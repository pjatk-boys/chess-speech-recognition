type ChessboardOptions = {
  position: string
}

type ChessboardSquare = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' }${'1' | '2' | '3' | '4' |'5' | '6' | '7' | '8'}`

type ChessboardPiece =
  | 'bp'
  | 'bn'
  | 'bb'
  | 'br'
  | 'bq'
  | 'bk'
  | 'wp'
  | 'wn'
  | 'wb'
  | 'wr'
  | 'wq'
  | 'wk'

declare module "cm-chessboard" {
  class Chessboard {
    constructor(element: HTMLElement, options?: ChessboardOptions);

    setPiece(square: ChessboardSquare, piece: ChessboardPiece, animated?: boolean): Promise<void>
    getPiece(square): ChessboardPiece | undefined;
    movePiece(squareFrom: ChessboardSquare, squareTo: ChessboardSquare, animated?: boolean): Promise<void>
    setPosition(fen: string, animated?: boolean): Promise<void>
    getPosition(): string;
  }
}

type EngineSquare = Uppercase<ChessboardSquare>
type EngineMove = Record<EngineSquare, EngineSquare>
type EngineMoves = Record<EngineSquare, EngineSquare[]>
type EngineConfiguration = {
  turn: "black" | "white",
  pieces: Partial<Record<EngineSquare, string>>
}
declare module "js-chess-engine" {
  class Game {
    constructor(fen: string);

    move(from: ChessboardSquare, to: ChessboardSquare): void;
    moves(): EngineMoves
    aiMove(aiLevel: number): EngineMove
    exportJson(): EngineConfiguration
  }
}