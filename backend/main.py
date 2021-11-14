import simplejson

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"]
)


@app.post("/notes")
async def pack_file(request: Request):
    form = await request.body()
    file = open("notes.json", "w")
    file.write(simplejson.dumps(simplejson.loads(form), indent=4, sort_keys=False))
    file.close()


@app.get("/notes")
def get_file_content():
    with open("notes.json", "r") as file:
        content = simplejson.loads(file.read())
    
    return content
