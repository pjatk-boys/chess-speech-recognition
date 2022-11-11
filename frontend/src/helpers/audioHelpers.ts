import { createSignal } from "solid-js";
import { ChessMoveValidationError, postChessMoveAudio } from "../services/api";
import { getGameHelpers } from "./gameHelpers";

export enum AudioError {
  PERMISSION_DENIED = 'Zablokowano dostęp do mikrofonu',
  VALIDATION_ERROR = 'Niepoprawny ruch',
  SERVER_ERROR = 'Wystąpił błąd podczas łączenia z serwerem'
}

const AUDIO_TYPE = "audio/webm";

type GetAudioHelpersParams = {
  movePiece: ReturnType<typeof getGameHelpers>['movePiece']
}

export const getAudioHelpers = ({movePiece}: GetAudioHelpersParams) => {
  let mediaRecorder: MediaRecorder;
  let timeoutId: NodeJS.Timeout;

  const [isRecording, setIsRecording] = createSignal(false);
  const [audioError, setAudioError] = createSignal<AudioError>();
  const [audioText, setAudioText] = createSignal('')

  const startRecording = async () => {
    const stream = await navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .catch((err) => {
          setAudioError(AudioError.PERMISSION_DENIED);
          throw err;
      });

    setAudioError()
    setIsRecording(true);

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: AUDIO_TYPE,
    });
    mediaRecorder.start();
    mediaRecorder.addEventListener("dataavailable", async ({ data }) => {
      if (mediaRecorder.state === "inactive") {
        try {
          const {call, text} = await postChessMoveAudio(new File([data], 'audio.webm'));
          movePiece(call)
          setAudioText(text);
        } catch (error) {
          if(error instanceof ChessMoveValidationError) {
            setAudioError(AudioError.VALIDATION_ERROR)
          } else {
            setAudioError(AudioError.SERVER_ERROR)
          }
        }
      }
    });

    // automatically cancel recording after 3 secs
    timeoutId = setTimeout(stopRecording, 3000);
  };

  const stopRecording = () => {
    clearTimeout(timeoutId);

    mediaRecorder.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording()) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return { toggleRecording, audioError, isRecording, audioText };
};
