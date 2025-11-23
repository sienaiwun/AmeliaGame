import React, { useState, useEffect, useRef } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { PLAYERS_CONFIG, generateItems, rollDice, ITEM_TYPES, BOARD_SIZE } from './gameUtils';
import { Settings, RefreshCw } from 'lucide-react';

function App() {
  const [players, setPlayers] = useState(
    PLAYERS_CONFIG.map(p => ({ ...p, position: 1, status: 'active', message: '' }))
  );
  const [items, setItems] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState('waiting'); // waiting, playing, finished
  const [diceColor, setDiceColor] = useState('#ffffff');
  const [showSettings, setShowSettings] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setItems(generateItems());
    setPlayers(PLAYERS_CONFIG.map(p => ({ ...p, position: 1, status: 'active', message: '' })));
    setCurrentPlayerIndex(0);
    setGameStatus('playing');
    setLastRoll(null);
    setLogs(['Game Started!']);
    setIsRolling(false);
  };

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const handleRoll = () => {
    if (gameStatus !== 'playing' || isRolling) return;

    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.status !== 'active') {
      nextTurn();
      return;
    }

    setIsRolling(true);
    const roll = rollDice();
    setLastRoll(roll);
    addLog(`${currentPlayer.name} rolled a ${roll}`);

    movePlayer(currentPlayerIndex, roll);
  };

  const movePlayer = (pIndex, steps) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = { ...newPlayers[pIndex] };

      let newPos = player.position + steps;
      if (newPos > BOARD_SIZE) newPos = BOARD_SIZE; // Cap at 100

      player.position = newPos;
      player.message = '';

      // Check Items
      const item = items[newPos];
      if (item) {
        if (item.type === ITEM_TYPES.BOMB) {
          player.status = 'out';
          player.message = 'BOOM! You hit a bomb!';
          addLog(`${player.name} hit a BOMB!`);
        } else if (item.type === ITEM_TYPES.YAKULT) {
          player.position = 1;
          player.message = 'Slipped on Yakult! Back to start!';
          addLog(`${player.name} slipped on Yakult!`);
        } else if (item.type === ITEM_TYPES.TREASURE) {
          player.position = Math.min(newPos + 3, BOARD_SIZE);
          player.message = 'Found Treasure! +3 steps!';
          addLog(`${player.name} found Treasure! +3 steps!`);
          // Reveal treasure
          setItems(prevItems => ({
            ...prevItems,
            [newPos]: { ...prevItems[newPos], visible: true }
          }));
        }
      }

      // Check Win
      if (player.position === BOARD_SIZE && player.status !== 'out') {
        player.status = 'finished';
        player.message = 'Finished!';
        addLog(`${player.name} Finished!`);
      }

      newPlayers[pIndex] = player;
      return newPlayers;
    });

    // Delay next turn to show animation/effect
    setTimeout(() => {
      nextTurn();
    }, 1000);
  };

  const nextTurn = () => {
    setPlayers(currentPlayers => {
      // Check if game over (all finished or out)
      const activePlayers = currentPlayers.filter(p => p.status === 'active');
      if (activePlayers.length === 0) {
        setGameStatus('finished');
        return currentPlayers;
      }

      let nextIndex = (currentPlayerIndex + 1) % currentPlayers.length;
      // Skip players who are finished or out
      let attempts = 0;
      while (currentPlayers[nextIndex].status !== 'active' && attempts < currentPlayers.length) {
        nextIndex = (nextIndex + 1) % currentPlayers.length;
        attempts++;
      }

      setCurrentPlayerIndex(nextIndex);
      setIsRolling(false);
      return currentPlayers;
    });
  };

  // AI Logic
  useEffect(() => {
    if (gameStatus === 'playing') {
      const currentPlayer = players[currentPlayerIndex];
      if (currentPlayer && currentPlayer.isAI && currentPlayer.status === 'active') {
        const timer = setTimeout(() => {
          handleRoll();
        }, 1500); // AI delay
        return () => clearTimeout(timer);
      }
    }
  }, [currentPlayerIndex, gameStatus, players]);

  return (
    <div className="app-container">
      <header className="game-header">
        <h1>Amelia's Adventure Board Game</h1>
        <button className="icon-btn" onClick={() => setShowSettings(true)}><Settings /></button>
      </header>

      <div className="game-layout">
        <div className="sidebar">
          <div className="player-list">
            {players.map((p, i) => (
              <div key={p.id} className={`player-card ${i === currentPlayerIndex ? 'active' : ''} ${p.status}`} style={{ borderColor: p.color }}>
                <div className="player-avatar" style={{ backgroundColor: p.color }}>{p.name[0]}</div>
                <div className="player-info">
                  <span className="player-name">{p.name}</span>
                  <span className="player-status">{p.status === 'active' ? `Pos: ${p.position}` : p.status.toUpperCase()}</span>
                </div>
                {p.message && <div className="player-message">{p.message}</div>}
              </div>
            ))}
          </div>

          <Controls
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            gameStatus={gameStatus}
            diceColor={diceColor}
            lastRoll={lastRoll}
            logs={logs}
            onRoll={handleRoll}
            isRolling={isRolling}
          />
        </div>

        <div className="board-container">
          <Board players={players} items={items} />
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Whiteboard Settings</h2>
            <label>Dice Color:</label>
            <input type="color" value={diceColor} onChange={(e) => setDiceColor(e.target.value)} />
            <button onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}

      {gameStatus === 'finished' && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Game Over!</h2>
            <button onClick={startNewGame}><RefreshCw /> Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
