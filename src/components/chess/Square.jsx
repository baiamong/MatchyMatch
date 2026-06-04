const PIECE_SYMBOLS = {
  pawn: { white: '♙', black: '♟' },
  rook: { white: '♖', black: '♜' },
  knight: { white: '♘', black: '♞' },
  bishop: { white: '♗', black: '♝' },
  queen: { white: '♕', black: '♛' },
  king: { white: '♔', black: '♚' },
}

export default function Square({
  piece,
  isLight,
  isSelected,
  isValidMove,
  onClick,
  row,
  col,
}) {
  const squareClass = [
    'chess-square',
    isLight ? 'light' : 'dark',
    isSelected && 'selected',
    isValidMove && 'valid-move',
  ]
    .filter(Boolean)
    .join(' ')

  const symbol = piece ? PIECE_SYMBOLS[piece.type][piece.color] : ''

  return (
    <button
      className={squareClass}
      onClick={onClick}
      aria-label={`Square ${String.fromCharCode(97 + col)}${8 - row}`}
    >
      {isValidMove && <div className="move-indicator" />}
      {piece && (
        <span className={`piece piece-${piece.color}`}>{symbol}</span>
      )}
    </button>
  )
}
