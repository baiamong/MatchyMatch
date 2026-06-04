export default function GameControls({
  onUndo,
  onReset,
  canUndo,
  gameOver,
}) {
  return (
    <div className="game-controls">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="control-btn undo-btn"
        title="Undo last move"
      >
        ↶ Undo
      </button>
      <button
        onClick={onReset}
        className="control-btn reset-btn"
        title="Start a new game"
      >
        {gameOver ? '🔄 Play Again' : '🔄 New Game'}
      </button>
    </div>
  )
}
