from pymongo import MongoClient
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()
# MONGO_URL="mongodb://localhost:27017/ethic"
database_url = os.environ.get("MONGO_URL") 

print(database_url)
conn=MongoClient(database_url) 