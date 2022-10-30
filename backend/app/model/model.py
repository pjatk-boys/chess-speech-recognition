from random import choice

from fastapi import APIRouter, UploadFile, File
from starlette.responses import JSONResponse

from ..config import settings
from ..logger import setup_custom_logger

FIRST_MODULE_TAG = "MODEL"
router = APIRouter()
logger = setup_custom_logger('model', settings.LOG_LEVEL)

example_moves = ['Nf3', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'd4', 'Bf4', 'Qb3']


@router.post("/predict", tags=[FIRST_MODULE_TAG])
async def predict(file: UploadFile = File(...)):
    logger.info(f"predict with file {file.filename}")
    return JSONResponse(
        status_code=200,
        content={"call": choice(example_moves)}
    )
