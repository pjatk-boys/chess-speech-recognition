import { Chessboard } from "cm-chessboard";
import { createSignal, onMount } from "solid-js";
import { Game } from "js-chess-engine";

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const AI_LEVEL = 2;

const parseEngineMove = (engineMove: EngineMove) => {
  const [from, to] = Object.entries(engineMove)[0];

  return [from.toLowerCase(), to.toLowerCase()] as [
    ChessboardSquare,
    ChessboardSquare
  ];
};

type DestructurizeCallReturnValue = {
  piece: ChessboardPiece;
  square: ChessboardSquare;
};

const destructurizeCall = (call: string): DestructurizeCallReturnValue => {
  let piece: ChessboardPiece = "wp";
  const callPiece = call[0].toLowerCase();
  if (["k", "q", "r", "b", "n"].includes(callPiece)) {
    switch (callPiece) {
      case "k":
        piece = "wk";
        break;
      case "q":
        piece = "wq";
        break;
      case "r":
        piece = "wr";
        break;
      case "b":
        piece = "wb";
        break;
      case "n":
        piece = "wn";
        break;
    }
    call = call.substring(1);
  }

  if (call[0] === "x") {
    call = call.substring(1);
  }

  if (call.length !== 2) {
    throw Error("Invalid move");
  }

  return { piece, square: call as ChessboardSquare };
};

export const getGameHelpers = (boardId: string) => {
  let board: Chessboard;

  const { searchParams } = new URL(window.location.href);
  const startingFEN = searchParams.get("fen") || DEFAULT_FEN;
  const game = new Game(startingFEN);

  const [isMakingMove, setIsMakingMove] = createSignal(false);
  const [moveError, setMoveError] = createSignal("");
  onMount(
    () =>
      (board = new Chessboard(document.getElementById(boardId), {
        position: startingFEN,
      }))
  );

  const makeAImove = () => {
    const [aiFrom, aiTo] = parseEngineMove(game.aiMove(AI_LEVEL));
    return board.movePiece(aiFrom, aiTo, true);
  };

  const movePiece = async (call: string) => {
    setIsMakingMove(true);
    setMoveError();
    const { piece, square } = destructurizeCall(call);
    const moves = game.moves();
    const from = Object.entries(moves).find(([from, to]) => {
      if (to.includes(square.toUpperCase() as EngineSquare)) {
        const boardPiece = board.getPiece(from.toLowerCase());
        console.debug(`from: ${from}, to: ${to}`)
        console.debug(
          `backend piece: ${piece}, possible board piece: ${boardPiece}`
        );

        return boardPiece === piece;
      }
      return false;
    });
    if (!from) {
      setMoveError("Niepoprawny ruch");
      return;
    }
    const fromSquare = from[0].toLowerCase() as ChessboardSquare;
    game.move(fromSquare, square);
    await board.movePiece(fromSquare, square, true);

    await makeAImove();
    setIsMakingMove(false);
  };

  const makeRandomMove = async () => {
    setIsMakingMove(true);
    await makeAImove();
    await makeAImove();
    setIsMakingMove(false);
  };

  return { movePiece, moveError, makeRandomMove, isMakingMove };
};
