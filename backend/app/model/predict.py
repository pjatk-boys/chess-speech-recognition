import io
import random

import wavio

from .model_manager import ModelManager, ModelInterpreter

model_manager = ModelManager()
model_interpreter = ModelInterpreter()


def predict_chess_move(file):
    data = wavio.read(io.BytesIO(file.file.read()))
    predicted_sentence: str = model_manager.predict(data)
    call: str = model_interpreter.interpret(predicted_sentence)
    return {"test": predicted_sentence,
            "call": call}


def fake_predict_chess_move(_):
    example_moves = ['Nf3', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'd4', 'Bf4', 'Qb3']
    predicted_sentence = "example predicted sentence"
    return {"test": predicted_sentence,
            "call": random.choice(example_moves)}
