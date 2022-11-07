import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.model import model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="https://pjatk-boys.github.io/",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def get():
    return {"status": "ok"}


app.include_router(model.router, prefix='/model')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000, workers=1)
