from fastapi import APIRouter, UploadFile, File
from starlette.responses import JSONResponse

from .predict import predict_chess_move
from ..config import settings
from ..logger import setup_custom_logger

FIRST_MODULE_TAG = "MODEL"
router = APIRouter()
logger = setup_custom_logger('model', settings.LOG_LEVEL)


@router.post("/predict", tags=[FIRST_MODULE_TAG])
async def predict(file: UploadFile = File(...)):
    logger.info(f"predict with file {file.filename}")
    return JSONResponse(
        status_code=200,
        content=predict_chess_move(file)
    )
