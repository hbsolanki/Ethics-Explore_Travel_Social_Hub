from datetime import datetime
from typing import List
from fastapi import APIRouter, File, Request, UploadFile
from fastapi.responses import RedirectResponse, JSONResponse
from bson import ObjectId
import shutil
import os
import cloudinary
import cloudinary.uploader
from Config.db import conn  # [import-error]

TripRouter = APIRouter()

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET")
)

# Helper Functions
async def get_tripdata(trip_id: ObjectId):
    """Retrieve trip data from the database by trip id."""
    data = conn.Ethics.Trip.find_one({"_id": trip_id})
    if data:
        data["_id"] = str(data["_id"])  # Convert ObjectId to string
    return data


def setup_destination(data: dict) -> dict:
    """Process form data and organize destination information."""
    form_dict = {}
    destination = []
    for key in data:
        if "destination" in key:
            destination.append(data[key])
        elif key != "photos":
            form_dict[key] = data[key]
    form_dict["destination"] = destination
    return form_dict


def create_notification(username: str, data: dict, trip_id: str) -> dict:
    """Create a notification structure when mentioning friends."""
    destination_place = ""
    for i in data["destination"]:
        destination_place=destination_place+","+i
    
    friends = data["friends"]
    notification = {
        "name": f"@{username} Mentioned in Their Trip",
        "by": username,
        "request": False,
        "details": f"@{username} {friends} Trip to {destination_place} - they invited you.",
        "trip_id": trip_id,
        "date": datetime.now(),
    }
    return notification


def friends_mention(data: dict, username: str, trip_id: str):
    """Mention friends in a trip and notify them."""
    mention_list = data["friends"].replace(" ", "").split("@")
    for friend in mention_list:
        if friend:
            friend_data = conn.Ethics.User.find_one({"username": friend})
            if friend_data:
                friend_data["notification"].append(create_notification(username, data, trip_id))
                conn.Ethics.User.find_one_and_update(
                    {"username": friend},
                    {"$set": {"notification": friend_data["notification"]}}
                )

# Routes
# Get trip data by username and trip ID
@TripRouter.get("/API/{username}/trip/{tripid}")
async def get_trip(request: Request):
    """Get trip information by username and trip ID."""
    params = request.path_params
    trip_id = ObjectId(params["tripid"])
    trip_data = await get_tripdata(trip_id)
    return JSONResponse(trip_data)

# Create a new trip
@TripRouter.post("/API/{username}/newtrip")
async def user_newtrip(
    username: str,
    request: Request,
    photos: List[UploadFile] = File(...),
):
    """Create a new trip and upload photos."""
    username = request.path_params["username"]
    data = await request.form()
    
    # Setup trip data
    trip_data = setup_destination(data)
    trip_data["username"] = username
    # Upload photos to Cloudinary
    photo_filenames = []
    if photos:
        for photo in photos:
            if photo.filename:
                result = cloudinary.uploader.upload(photo.file)
                photo_filenames.append(result['secure_url'])
    trip_data["photos"] = photo_filenames

    # Insert trip data into the database
    trip = conn.Ethics.Trip.insert_one(trip_data)
    trip_id = trip.inserted_id

    # Update user data with new trip
    user_data = conn.Ethics.User.find_one({"username": username})
    user_data["trips"].append(trip_id)
    user_data["recent_activity"].append(trip_id)
    conn.Ethics.User.update_one(
        {"username": username},
        {"$set": {"trips": user_data["trips"], "recent_activity": user_data["recent_activity"]}}
    )

    # Mention friends in the trip
    friends_mention(data, username, str(trip_id))

    # Notify followers about the new trip
    for follower in user_data["followers"]:
        print(follower)
        print(follower["username"])
        follower_data = conn.Ethics.User.find_one({"username": follower["username"]})
        follower_data["recent_activity"].append(trip_id)
        conn.Ethics.User.find_one_and_update(
            {"username": follower["username"]},
            {"$set": {"recent_activity": follower_data["recent_activity"]}}
        )

    return RedirectResponse(url=f"http://localhost:5173/{username}/home", status_code=302)