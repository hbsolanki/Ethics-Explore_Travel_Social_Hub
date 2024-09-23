from pydantic import BaseModel

class Trip(BaseModel):
    Trip_Name:str=""
    username:str=""
    source:str=""
    status:str=""
    destination:list=[]
    disciption:str=""
    friends:str=""
    date:str=""
    photos:list=[]
    
