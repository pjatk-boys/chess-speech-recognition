type ChessboardOptions = {
  position: string
}

type ChessboardSquare = `${'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' }${'1' | '2' | '3' | '4' |'5' | '6' | '7' | '8'}`

declare enum ChessboardPiece {
  BLACK_PAWN,
  BLACK_KNIGHT,
  BLACK_BISHOP,
  BLACK_ROOK,
  BLACK_QUEEN,
  BLACK_KING,
  WHITE_PAWN,
  WHITE_KNIGHT,
  WHITE_BISHOP,
  WHITE_ROOK,
  WHITE_QUEEN,
  WHITE_KING,
}

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

type EngineSquare = `${'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' }${'1' | '2' | '3' | '4' |'5' | '6' | '7' | '8'}`
type EngineMove = Record<EngineSquare, EngineSquare>

declare module "js-chess-engine" {
  class Game {
    constructor(fen: string);

    move(from: ChessboardSquare, to: ChessboardSquare): void;
    aiMove(aiLevel: number): EngineMove
  }
}