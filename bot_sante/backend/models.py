from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    phone: str
    password: str
    language_preference: Optional[str] = "fr"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Message(BaseModel):
    sender: str  # "user" ou "bot"
    message_type: str  # "text" ou "audio"
    content: str
    audio_path: Optional[str] = None
    timestamp: datetime

class Conversation(BaseModel):
    user_id: str
    start_time: datetime
    messages: List[Message]
