import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import GridGameScreen from './components/GridGameScreen';
import { GameState, GameMode, WordPair } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.BALLOON);
  
  // Data for Balloon Game
  const [balloonWords, setBalloonWords] = useState<WordPair[]>([]);
  
  // Data for Grid Game
  const [gridWords, setGridWords] = useState<string[]>([]);

  const handleStartGame = (data: WordPair[] | string[], mode: GameMode) => {
    setGameMode(mode);
    if (mode === GameMode.BALLOON) {
      setBalloonWords(data as WordPair[]);
    } else {
      setGridWords(data as string[]);
    }
    setGameState(GameState.PLAYING);
  };

  const handleVictory = () => {
    setGameState(GameState.VICTORY);
  };

  const handleRestart = () => {
    setGameState(GameState.SETUP);
  };

  const handleReplay = () => {
    setGameState(GameState.PLAYING); // Re-mounts GameScreen/GridScreen
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {gameState === GameState.SETUP && (
        <SetupScreen onStartGame={handleStartGame} />
      )}

      {gameState === GameState.PLAYING && gameMode === GameMode.BALLOON && (
        <GameScreen 
          words={balloonWords} 
          onVictory={handleVictory} 
          onBack={handleRestart}
        />
      )}

      {gameState === GameState.PLAYING && gameMode === GameMode.GRID && (
        <GridGameScreen 
          words={gridWords} 
          onBack={handleRestart} 
        />
      )}

      {gameState === GameState.VICTORY && gameMode === GameMode.BALLOON && (
        <div className="flex flex-col items-center justify-center h-full bg-sky-200 space-y-8 animate-in fade-in duration-700">
           <div className="text-6xl animate-bounce">🏆</div>
           <h1 className="text-5xl font-display font-bold text-sky-600 drop-shadow-white">Awesome!</h1>
           <p className="text-xl text-sky-800 font-bold">You matched all the words!</p>
           
           <div className="flex gap-4">
             <button 
               onClick={handleReplay}
               className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all text-xl"
             >
               Play Again
             </button>
             <button 
               onClick={handleRestart}
               className="bg-white hover:bg-gray-50 text-sky-600 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all text-xl"
             >
               New Words
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;