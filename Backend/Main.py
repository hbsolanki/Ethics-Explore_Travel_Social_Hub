import uvicorn
from fastapi import FastAPI

from Routes.User import UserRouter
from fastapi.middleware.cors import CORSMiddleware

from Routes.Trip import TripRouter

app=FastAPI()
origins = [
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(UserRouter)
app.include_router(TripRouter)

