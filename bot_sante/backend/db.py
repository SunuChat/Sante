from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId

MONGO_DETAILS = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)

db = client.chatbot_db  # Nom de ta base de données
users_collection = db.get_collection("users")
conversations_collection = db.get_collection("conversations")
