from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


PHONE_PATTERN = r"^\+?[0-9\s().-]{7,30}$"


class CustomerBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(pattern=PHONE_PATTERN, max_length=30)


class CustomerCreate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
