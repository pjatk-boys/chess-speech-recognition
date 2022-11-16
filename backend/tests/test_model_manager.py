import json
import unittest
from pathlib import Path
from unittest import TestCase

import jiwer
import wavio

from app.model.model_manager import ModelManager, ModelInterpreter


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
        data = read_wav_from_file("../data/recordings/calls/wE6.wav")
        predicted_value = self.model_manager.predict(data)
        self.assertEqual(predicted_value, "wieża na e sześć")


class TestModelInterpreter(TestCase):
    def setUp(self) -> None:
        self.model_interpreter = ModelInterpreter()

    def test_parse_to_code(self):
        # given
        figure = "pion"
        na = "na"
        letter = 'e'
        number = 'sześć'
        expected_code = "E6"
        # when
        call = self.model_interpreter.parse_to_code(figure, na, letter, number)
        # then
        self.assertEqual(expected_code, call)

    def test_interpret_sentence(self):
        # given
        sentence = "koń na a cztery"
        excepted_code = "gA4"
        # when
        interpreted_code = self.model_interpreter.interpret(sentence)
        # then
        self.assertEqual(excepted_code, interpreted_code)


class TestModelAccuracy(TestCase):
    def setUp(self) -> None:
        self.model_manager = ModelManager()

    def test_accuracy(self):
        with open("../data/recordings/calls/text.json", 'rt') as f:
            ground_truth = json.loads(f.read())
        preds = {}
        for f in Path('../data/recordings/calls').glob('*.wav'):
            wav_file = read_wav_from_file(str(f))
            predicted_value = self.model_manager.predict(wav_file)
            preds[f.stem] = predicted_value

        r, h = [], []
        for f in preds:
            r.append(ground_truth[f])
            h.append(preds[f])
        measures = jiwer.compute_measures(r, h)
        self.assertLess(measures['wer'], 0.1)


if __name__ == '__main__':
    unittest.main()
