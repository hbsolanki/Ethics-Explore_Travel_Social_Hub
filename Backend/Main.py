import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes.User import UserRouter
from Routes.Trip import TripRouter

app=FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "https://main.d2uzrq378xbbmn.amplifyapp.com"
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

