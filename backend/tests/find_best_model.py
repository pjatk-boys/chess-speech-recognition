import json
from pathlib import Path

import jiwer
import numpy as np

from app.model.model_manager import ModelManager
from tests.test_model_manager import read_wav_from_file


def test_get_most_acc(self):
    alpha_range = np.arange(-5, 5, 0.2)
    beta_range = np.arange(-5, 5, 0.2)

    results = []
    for alpha in alpha_range:
        for beta in beta_range:
            print(alpha)
            print(beta)

            self.model_manager = ModelManager(alpha, beta)

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
                results.append({'wer': measures['wer'], 'alpha': alpha, 'beta': beta})

    lowest_wer = min(results, key=lambda x: x['wer'])
    print(lowest_wer)  # {'wer': 0.25, 'alpha': 4.440892098500626e-15, 'beta': 2.4000000000000066}
