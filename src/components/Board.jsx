import React from 'react';
import { BOARD_SIZE, ITEM_TYPES } from '../gameUtils';
import { Bomb, Gift, Trophy } from 'lucide-react'; // Using icons for items

function Board({ players, items }) {
    // Generate 100 cells
    const cells = Array.from({ length: BOARD_SIZE }, (_, i) => i + 1);

    // Helper to calculate position
    const getPlayerStyle = (position, index) => {
        const posIndex = position - 1;
        const row = Math.floor(posIndex / 10);
        const col = posIndex % 10;

        // Offset for multiple players on same spot
        // We can use the player's index to add a slight offset
        const offset = index * 3;

        return {
            top: `${row * 10}%`,
            left: `${col * 10}%`,
            transform: `translate(${offset}px, ${offset}px)`,
            zIndex: 10 + index
        };
    };

    return (
        <div className="board">
            {cells.map(cellNum => {
                const item = items[cellNum];

                return (
                    <div key={cellNum} className="cell" data-number={cellNum}>
                        <span className="cell-number">{cellNum}</span>

                        {/* Items */}
                        {item && item.visible && (
                            <div className={`item ${item.type}`}>
                                {item.type === ITEM_TYPES.BOMB && <Bomb size={20} color="#e74c3c" />}
                                {item.type === ITEM_TYPES.YAKULT && <span style={{ fontSize: '20px' }}>🥤</span>}
                                {item.type === ITEM_TYPES.TREASURE && <Trophy size={20} color="#f1c40f" />}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Players Layer */}
            {players.map((p, i) => (
                <div
                    key={p.id}
                    className="player-token absolute"
                    style={{
                        backgroundColor: p.color,
                        ...getPlayerStyle(p.position, i)
                    }}
                    title={p.name}
                >
                    {p.name[0]}
                </div>
            ))}
        </div>
    );
}

export default Board;
