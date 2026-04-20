import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from services.errors import ServiceError


class Base(DeclarativeBase):
    pass


def _get_database_url() -> str:
    db_type = os.getenv("DB_TYPE", "mysql").strip().lower()

    if db_type == "mysql":
        host = os.getenv("DB_HOST", "localhost").strip()
        port = os.getenv("DB_PORT", "3306").strip()
        user = os.getenv("DB_USER", "root").strip()
        password = os.getenv("DB_PASSWORD", "").strip()
        database = os.getenv("DB_NAME", "aksesa").strip()

        if not all([host, database]):
            raise ServiceError(
                code="DB_NOT_CONFIGURED",
                message="Database belum dikonfigurasi.",
                status_code=503,
            )

        return f"mysql+aiomysql://{user}:{password}@{host}:{port}/{database}"

    elif db_type == "sqlite":
        db_path = os.getenv("DB_SQLITE_PATH", "./aksesa.db").strip()
        return f"sqlite+aiosqlite:///{db_path}"

    raise ServiceError(
        code="DB_NOT_CONFIGURED",
        message=f"Tipe database tidak didukung: {db_type}",
        status_code=503,
    )


_engine = None
_session_factory = None


def get_engine():
    global _engine
    if _engine is None:
        database_url = _get_database_url()
        _engine = create_async_engine(
            database_url,
            echo=os.getenv("DB_ECHO", "false").strip().lower() == "true",
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )
    return _engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    global _session_factory
    if _session_factory is None:
        _session_factory = async_sessionmaker(
            bind=get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
        )
    return _session_factory


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    factory = get_session_factory()
    async with factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    global _engine, _session_factory
    if _engine:
        await _engine.dispose()
        _engine = None
    _session_factory = None