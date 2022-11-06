import { Chessboard } from "cm-chessboard";
import { createSignal, onMount } from "solid-js";
import {Game} from 'js-chess-engine'

const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const AI_LEVEL = 2

const parseEngineMove = (engineMove: EngineMove) => {
  const [from, to] =  Object.entries(engineMove)[0]

  return [from.toLowerCase(), to.toLowerCase()] as [ChessboardSquare, ChessboardSquare]
}

export const getGameHelpers = (boardId: string) => {
  let board: Chessboard;

  const {searchParams} = new URL(window.location.href)
  const startingFEN = searchParams.get('fen') || DEFAULT_FEN;
  const game = new Game(startingFEN);
  
  const [isMakingMove, setIsMakingMove] = createSignal(false);
  onMount(() => board = new Chessboard(document.getElementById(boardId), {position: startingFEN}));

  const makeAImove = () => {
    const [aiFrom, aiTo] = parseEngineMove(game.aiMove(AI_LEVEL))
    return board.movePiece(aiFrom, aiTo, true)
  }

  const movePiece = async (from: ChessboardSquare, to: ChessboardSquare) => {
    setIsMakingMove(true);
    game.move(from, to)
    await board.movePiece(from, to, true)

    await makeAImove();
    setIsMakingMove(false);
  }

  const makeRandomMove = async () => {
    setIsMakingMove(true);
    await makeAImove();
    await makeAImove();
    setIsMakingMove(false)
  }

  return {movePiece, makeRandomMove, isMakingMove}
}