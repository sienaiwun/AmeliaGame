import React from 'react';

function Controls({ players, currentPlayerIndex, gameStatus, diceColor, lastRoll, logs, onRoll, isRolling }) {
    const currentPlayer = players[currentPlayerIndex];

    return (
        <div className="game-controls">
            <div className="dice-section">
                <div className="dice-display" style={{ backgroundColor: diceColor }}>
                    {lastRoll !== null ? lastRoll : '?'}
                </div>
                <button
                    className="roll-btn"
                    onClick={onRoll}
                    disabled={currentPlayer.isAI || gameStatus !== 'playing' || isRolling}
                >
                    {currentPlayer.isAI ? 'AI Rolling...' : (isRolling ? 'Rolling...' : 'ROLL DICE')}
                </button>
            </div>

            <div className="logs-section">
                <h3>Game Log</h3>
                <div className="logs">
                    {logs.map((l, i) => <div key={i} className="log-entry">{l}</div>)}
                </div>
            </div>
        </div>
    );
}

export default Controls;
