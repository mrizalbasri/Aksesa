from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str = Field(pattern=r".+@.+\..+")
    password: str = Field(min_length=8, max_length=128)


class RegisterRequest(BaseModel):
    email: str = Field(pattern=r".+@.+\..+")
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=2, max_length=255)
    business_name: str | None = Field(default=None, max_length=255)
    phone: str | None = Field(default=None, max_length=20)


class GoogleLoginRequest(BaseModel):
    credential: str = Field(min_length=20, max_length=12000)


class UserResponse(BaseModel):
    id: str
    email: str = Field(pattern=r".+@.+\..+")
    name: str
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

