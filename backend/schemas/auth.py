from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str = Field(pattern=r".+@.+\..+")
    password: str = Field(min_length=8, max_length=128)


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

