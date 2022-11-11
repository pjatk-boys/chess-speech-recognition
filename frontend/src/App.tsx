import { Component } from "solid-js";

import classes from "./App.module.scss";
import { getAudioHelpers } from "./helpers/audioHelpers";
import { getGameHelpers } from "./helpers/gameHelpers";

const BOARD_ID = "board1";

const App: Component = () => {
  const { movePiece, moveError, makeRandomMove, isMakingMove } =
    getGameHelpers(BOARD_ID);
  const { toggleRecording, audioText, isRecording, audioError } =
    getAudioHelpers({
      movePiece,
    });

  return (
    <div class={classes.app}>
      <div id={BOARD_ID} class={classes.board}></div>
      <div class={classes.actionsContainer}>
        {!isRecording() && (
          <>
            {audioError() && <p class={classes.errorMessage}>{audioError()}</p>}
            {moveError() && <p class={classes.errorMessage}>{moveError()}</p>}
            {audioText() && <p>Przetworzony ruch: {audioText()}</p>}
          </>
        )}

        <button
          class={classes.microphoneButton}
          onClick={toggleRecording}
          data-is-recording={isRecording()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.9 490.9">
            <path d="M245.5 322.9c53 0 96.2-43.2 96.2-96.2V96.2c0-53-43.2-96.2-96.2-96.2s-96.2 43.2-96.2 96.2v130.5c0 53.1 43.2 96.2 96.2 96.2zM173.8 96.2c0-39.5 32.2-71.7 71.7-71.7s71.7 32.2 71.7 71.7v130.5c0 39.5-32.2 71.7-71.7 71.7s-71.7-32.2-71.7-71.7V96.2z" />
            <path d="M94.4 214.5c-6.8 0-12.3 5.5-12.3 12.3 0 85.9 66.7 156.6 151.1 162.8v76.7h-63.9c-6.8 0-12.3 5.5-12.3 12.3s5.5 12.3 12.3 12.3h152.3c6.8 0 12.3-5.5 12.3-12.3s-5.5-12.3-12.3-12.3h-63.9v-76.7c84.4-6.3 151.1-76.9 151.1-162.8 0-6.8-5.5-12.3-12.3-12.3s-12.3 5.5-12.3 12.3c0 76.6-62.3 138.9-138.9 138.9s-138.9-62.3-138.9-138.9c.2-6.8-5.2-12.3-12-12.3z" />
          </svg>
        </button>
        <button
          class={classes.button}
          onClick={makeRandomMove}
          disabled={isMakingMove()}
        >
          Zrób losowy ruch
        </button>
      </div>
    </div>
  );
};

export default App;
