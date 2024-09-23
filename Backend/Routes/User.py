from fastapi import APIRouter,Request,Form, Depends, HTTPException, status,File
from fastapi.responses import RedirectResponse,JSONResponse,Response
from Models.User import User
from Config.db import conn  # [import-error]
from bson import ObjectId

from Auth.Auth import ACCESS_TOKEN_EXPIRE_MINUTES,create_access_token,authenticate_user,get_current_user
from datetime import timedelta
from pydantic import BaseModel,EmailStr
import os
from dotenv import load_dotenv
load_dotenv()


UserRouter=APIRouter()


# Login Model
class UserLogin(BaseModel):
    username: str
    password: str

# User Registration Model (for cleaner input)
class UserRegistration(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

# Registration
@UserRouter.post("/API/registration")
async def user_registration(user_registration: UserRegistration):
    user = conn.Ethics.User.find_one({"username": user_registration.username})

    if not user:
        user_data = dict(user_registration)
        user_data["profile_picture"] = "https://res.cloudinary.com/ddm8umfu7/image/upload/v1726760053/Profile_picture_q4tcgj.webp"
        user_data["notification"]=[]
        user_data["trips"]=[]
        user_data["followings"]=[]
        user_data["followers"]=[]
        user_data["recent_activity"]=[]
        user_data["bio"]=""
        user_data["website"]=""

        conn.Ethics.User.insert_one(user_data)
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_registration.username},
            expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, 
            content={"detail": "Username already exists!"}
        )



# Signin
@UserRouter.post("/API/signin")
async def user_signin(user_login:UserLogin):
    authenticated_user = authenticate_user(user_login.username, user_login.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_login.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
   
#:username
@UserRouter.get("/API/{username}")
async def user_data(request:Request):
    username=request.path_params
    user_data= conn.Ethics.User.find_one(username) # type: ignore
    try:
        user_data["_id"]=str(user_data["_id"])
        
        for i in range(len(user_data["trips"])):
            user_data["trips"][i]=await get_tripdata(user_data["trips"][i])

        for i in range(len(user_data["notification"])):
            user_data["notification"][i]=await get_tripdata(user_data["notification"][i])

        for i in range(len(user_data["recent_activity"])):
            user_data["recent_activity"][i]=await get_tripdata(user_data["recent_activity"][i])

        return JSONResponse(user_data)
    except :
        raise HTTPException(status_code=404, detail="User Not Found")
    \
    

#Get Trip
async def get_tripdata(id):
    data=conn.Ethics.Trip.find_one({"_id":id})
    if data:
        data["_id"]=str(data["_id"]) # type: ignore
    return data


#/:username/trip/:tripid
@UserRouter.get("/API/{username}/trip/{tripid}")
async def get_trip(request:Request):
    params=request.path_params
    tripid=params["tripid"]
    object_id = ObjectId(tripid)
    trip_data=await get_tripdata(object_id)
    return JSONResponse( trip_data)
    

import shutil
import os
import cloudinary
import cloudinary.uploader

cloudinary.config( 
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET")
)





#User Profile Update
@UserRouter.post("/API/{username}/profilesetting")
async def user_profilesetting(request:Request):
    username=request.path_params["username"]
    form_data=await request.form()
    form_data=dict(form_data)
    
    user=conn.Ethics.User.find_one({"username":username})
    try:
        profile_picture=form_data["profile_picture"]
        upload_result = cloudinary.uploader.upload(profile_picture.file, folder="profile_pictures")
        form_data["profile_picture"]=upload_result["url"]
    except:
        if not user["profile_picture"]: 
            form_data["profile_picture"]="https://res.cloudinary.com/ddm8umfu7/image/upload/v1725167390/profile_pictures/ipeyo0cpwxtjzlyyaehs.webp"
        else:
            form_data["profile_picture"]=user["profile_picture"]
        
        
    conn.Ethics.User.update_one({"username":username},{"$set":form_data})
    return RedirectResponse(url=f"http://localhost:5173/{username}",status_code=302)


#Search 
#get All User
@UserRouter.get("/API/{username}/search/alluser")
async def get_allUser(request:Request):
    username=request.path_params

    all_user=conn.Ethics.User.find() # type: ignore
    
    try:
       all_user=list(all_user)
       allUserRetrun=[]
       for user in all_user:
           user={"username":user["username"],"name":user["name"],"profile_picture":user["profile_picture"]}
           allUserRetrun.append(user)
       return allUserRetrun
           
    except :
        return ""
        # raise HTTPException(status_code=404, detail="User Not Found")




#For Following
@UserRouter.get("/API/{username}/following/{following_username}")
async def user_following(request: Request):
    try:
        params=request.path_params
        username=params["username"]
        following_username=params["following_username"]
        user=conn.Ethics.User.find_one({"username":username})
        user_following=conn.Ethics.User.find_one({"username":following_username})

        user["followings"].append({"username":following_username,"name":user_following["name"],"pic":user_following["profile_picture"]})
        user_following["followers"].append({"username":username,"name":user["name"],"pic":user["profile_picture"]})

        conn.Ethics.User.update_one({"username":username},{"$set":{"followings":user["followings"]}})
        conn.Ethics.User.update_one({"username":following_username},{"$set":{"followers":user_following["followers"]}})
        return {"message": "Follow out successfully"}
    
    except:
        return HTTPException(status_code=404, detail="User Not Found")

#Remove Following 
@UserRouter.get("/API/{username}/unfollow/{following_username}")
async def user_following(request: Request):
    # try:
    params=request.path_params
    username=params["username"]
    following_username=params["following_username"]
    user=conn.Ethics.User.find_one({"username":username})
    following_user=conn.Ethics.User.find_one({"username":following_username})
    
    for trip in user["recent_activity"]:
        trip_db=conn.Ethics.Trip.find_one(trip)
        if trip_db["username"]==following_username:
            user["recent_activity"].remove(trip)

    for following in user["followings"]:
        if following["username"]==following_username:
            user["followings"].remove(following)

    for follower in following_user["followers"]:
        if follower["username"]==username:
            following_user["followers"].remove(follower)
    
    conn.Ethics.User.update_one({"username":username},{"$set":{"followings":user["followings"]}})
    conn.Ethics.User.update_one({"username":following_username},{"$set":{"followers":following_user["followers"]}})
    
    return {"message": "Follow out successfully"}
    
    # except:
    #     return HTTPException(status_code=404, detail="User Not Found")




# Logout
@UserRouter.post("/API/logout")
async def user_logout(response: Response):
    current_user: User = Depends(get_current_user)
    if current_user:
        response.delete_cookie(key="access_token")
        return {"message": "Logged out successfully"}
    else :
        return  HTTPException(status_code=404, detail="User Not Found")
    

@UserRouter.get("/API/{username}/recentactivity")
async def user_recent_activity(request:Request):
    username=request.path_params
    user_data=conn.Ethics.User.find_one(username) 
    recentactivity=[]
    for i in range(len(user_data["recent_activity"])):
        recentactivity.append(await get_tripdata(user_data["recent_activity"][i]))
    return recentactivity

@UserRouter.get("/API/{username}/notification")
async def user_recent_activity(request:Request):
    username=request.path_params
    user_data=conn.Ethics.User.find_one(username) 
    notification=[]
    for i in user_data["notification"]:
        i["trip_id"]=str(i["trip_id"])
        notification.append(i)
    return notification

@UserRouter.get("/API/{username}/notification/accept/{tripid}")
async def user_notification_accept(request:Request):
    params=request.path_params
    username=params["username"]
    tripid=params["tripid"]

    user_data=conn.Ethics.User.find_one({"username":username})
    user_data["trips"].append(ObjectId(tripid))
    for i in range(len(user_data["notification"])):
        if str(user_data["notification"][i]["trip_id"])==tripid:
            user_data["notification"][i]["request"]=True

    conn.Ethics.User.update_one({"username":username},{"$set":{"trips":user_data["trips"],"notification":user_data["notification"]}})

    return {"message":"request successfully accept"}

@UserRouter.get("/API/{username}/notification/reject/{tripid}")
async def user_notification_reject(request:Request):
    params=request.path_params
    username=params["username"]
    tripid=params["tripid"]

    user_data=conn.Ethics.User.find_one({"username":username})
    for i in range(len(user_data["notification"])):
        if str(user_data["notification"][i]["trip_id"])==tripid:
            user_data["notification"].remove(user_data["notification"][i])

    conn.Ethics.User.update_one({"username":username},{"$set":{"notification":user_data["notification"]}})

    return {"message":"request successfully accept"}


@UserRouter.get("/API/{username}/notification/remove/{tripid}")
async def user_notification_remove(request:Request):
    params=request.path_params
    username=params["username"]
    tripid=params["tripid"]

    user_data=conn.Ethics.User.find_one({"username":username})
    user_data["trips"].remove(ObjectId(tripid))
    for i in range(len(user_data["notification"])):
        if str(user_data["notification"][i]["trip_id"])==tripid:
            user_data["notification"][i]["request"]=False

    conn.Ethics.User.update_one({"username":username},{"$set":{"trips":user_data["trips"],"notification":user_data["notification"]}})

    return {"message":"request successfully remove"}