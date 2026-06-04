export default function MoveHistory({ moves }) {
  return (
    <div className="move-history">
      <div className="history-header">Move History</div>
      <div className="history-list">
        {moves.length === 0 ? (
          <div className="no-moves">No moves yet</div>
        ) : (
          moves.map((move, idx) => (
            <div key={idx} className="move-entry">
              <span className="move-number">{Math.floor(idx / 2) + 1}.</span>
              <span className="move-notation">{move.notation}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
