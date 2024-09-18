import cloudinary
import cloudinary.uploader
import os


# Configuration       
cloudinary.config( 
    cloud_name = os.environ.get("CLOUD_NAME"), 
    api_key = os.environ.get("CLOUD_API_KEY"), 
    api_secret = os.environ.get("CLOUD_API_SECRET"), # Click 'View API Keys' above to copy your API secret
    secure=True
)
