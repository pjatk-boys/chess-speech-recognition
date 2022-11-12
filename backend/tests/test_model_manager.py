import unittest
from unittest import TestCase

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


if __name__ == '__main__':
    unittest.main()
