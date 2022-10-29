import uvicorn
from fastapi import FastAPI

from backend.app.model import model

app = FastAPI()


@app.get("/")
async def get():
    return {"status": "ok"}

app.include_router(model.router, prefix='/model')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000, workers=1)
