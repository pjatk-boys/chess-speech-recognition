import librosa
import numpy as np
import wavio
from pyctcdecode import build_ctcdecoder, BeamSearchDecoderCTC
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor


class ModelManager:
    def __init__(self):
        self.model = Wav2Vec2ForCTC.from_pretrained('facebook/wav2vec2-base-10k-voxpopuli-ft-pl')  # .to('cuda')
        self.processor = Wav2Vec2Processor.from_pretrained('facebook/wav2vec2-base-10k-voxpopuli-ft-pl')
        self.decoder: BeamSearchDecoderCTC = self.read_decoder()
        self.target_sr: int = 16000

    def predict(self, data: wavio.Wav) -> str:
        resampled_file = self.resample_file(data)
        features = self.processor(resampled_file,
                                  sampling_rate=self.target_sr, return_tensors='pt', padding=True)  # .to('cuda')
        out = self.model(input_values=features.input_values)
        decoded_sentence = self.decoder.decode(out.logits.cpu().detach().numpy()[0])
        return decoded_sentence

    def resample_file(self, data: wavio.Wav) -> np.ndarray:
        fs = data.rate
        return librosa.resample(data.data.squeeze().astype('float32'), orig_sr=fs, target_sr=self.target_sr)

    def read_decoder(self) -> BeamSearchDecoderCTC:
        """
        raises a warning: Only 28 unigrams passed as vocabulary. Is this small or artificial data?
        yes, it's small data
        :return:
        :rtype:
        """
        tokens = [x[0] for x in sorted(self.processor.tokenizer.get_vocab().items(), key=lambda x: x[1])]
        tokens[4] = ' '
        decoder = build_ctcdecoder(tokens,
                                   './models/chess.arpa',
                                   alpha=2.0, beta=-1.0)
        return decoder


class ModelInterpreter:
    def __init__(self):
        self.code_mapping = {
            "figures": {"goniec": "g", "koń": "g", "laufer": "g", "wieża": "w",
                        "królowa": "", "hetman": "", "król": "", "skoczek": "",
                        "pionek": "", "pion": ""  # leave these two empty
                        },
            "numbers": {'jeden': "1", "dwa": "2", "trzy": "3", "cztery": "4",
                        "pięć": "5", "sześć": "6", "siedem": "7", "osiem": "8", "dziewięć": "9"},
        }

    def interpret(self, sentence: str):
        """
        based on chess call parse it to code move.
        i.e: "wieża na e sześć" -> "wE6"
        """
        split_sentence = sentence.split(" ")
        if len(split_sentence) == 4:
            figure = split_sentence[0]  # koń
            na = split_sentence[1]  # na
            letter = split_sentence[2]  # e
            number = split_sentence[3]  # 6
            try:
                return self.parse_to_code(figure, na, letter, number)
            except (ValueError, KeyError):
                return self.match_tokens_to_code()
        else:
            self.match_sentence_to_code()

    def parse_to_code(self, figure, na, letter, number) -> str:
        if na != "na":
            raise ValueError
        if len(letter) != 1:
            raise ValueError

        figure_code = self.code_mapping["figures"][figure]
        number_code = self.code_mapping["numbers"][number]
        return figure_code + letter.upper() + number_code

    def match_sentence_to_code(self):
        return "sentence"

    def match_tokens_to_code(self):
        return "tokens"
