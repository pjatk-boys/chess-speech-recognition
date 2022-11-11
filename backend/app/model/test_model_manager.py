from unittest import TestCase

import wavio

from app.model.model_manager import ModelManager


def read_wav_from_file(file_name: str) -> wavio.Wav:
    data = wavio.read(file_name)
    rate = data.rate
    print(f"sound rate: {rate}")
    return data


class TestModelManager(TestCase):
    def setUp(self) -> None:
        self.model_manager = ModelManager()

    def test_model_manager_constructor(self):
        self.assertIsInstance(self.model_manager, ModelManager)

    def test_predict(self):
        data = read_wav_from_file(
            "/Users/kuba/PJATK/semestr3/ZUM/chess-speech-recognition/data/recordings/calls/wE6.wav")
        predicted_value = self.model_manager.predict(data)
        self.assertEqual(predicted_value, "wieża na e sześć")
