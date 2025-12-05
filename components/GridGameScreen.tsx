import React, { useState, useEffect } from 'react';

interface GridGameScreenProps {
  words: string[];
  onBack: () => void;
}

interface Cell {
  id: number;
  word: string;
  type: 'flower' | 'bomb';
  isFlipped: boolean;
}

const GridGameScreen: React.FC<GridGameScreenProps> = ({ words, onBack }) => {
  const [grid, setGrid] = useState<Cell[]>([]);
  const [round, setRound] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Setup the grid with the provided words
  const setupGrid = () => {
    setIsAnimating(true);
    // Small delay to allow flip back animation if regenerating
    setTimeout(() => {
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);
        const bombIndex = Math.floor(Math.random() * 9);
        
        const newGrid: Cell[] = Array.from({ length: 9 }).map((_, i) => ({
          id: i,
          word: shuffledWords[i] || "Unknown",
          type: i === bombIndex ? 'bomb' : 'flower',
          isFlipped: false,
        }));
        
        setGrid(newGrid);
        setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    setupGrid();
  }, [words]); // Run once when words change (mount)

  const handleRegenerate = () => {
    setGrid(prev => prev.map(c => ({ ...c, isFlipped: false }))); // Flip all back first
    setRound(r => r + 1);
    setupGrid();
  };

  const handleCellClick = (index: number) => {
    if (grid[index].isFlipped || isAnimating) return;

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[index] = { ...newGrid[index], isFlipped: true };
      return newGrid;
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
       {/* Background Decor */}
      <div className="absolute top-10 left-10 text-white opacity-40 animate-[drift_60s_linear_infinite]">
        <CloudIcon size={260} />
      </div>
      <div className="absolute top-40 left-[80%] text-white opacity-30 animate-[drift_80s_linear_infinite]">
        <CloudIcon size={200} />
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={onBack}
          className="bg-white/80 hover:bg-white text-sky-600 rounded-full p-2 px-4 shadow font-bold transition-all"
        >
          ← Exit
        </button>
      </div>

      <div className="z-10 w-full max-w-lg flex flex-col items-center gap-6">
        <div className="flex items-center justify-between w-full px-4">
             <h2 className="text-2xl font-display font-bold text-sky-700 bg-white/50 px-4 py-2 rounded-full">Round {round}</h2>
             <button 
                onClick={handleRegenerate}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-6 rounded-full shadow-lg transform active:scale-95 transition-all"
            >
                🔄 Shuffle
            </button>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full aspect-square">
            {grid.map((cell, index) => (
                <div 
                    key={`${round}-${index}`} // Key forces re-render on new round for clean animation
                    onClick={() => handleCellClick(index)}
                    className="relative group perspective-1000 cursor-pointer"
                >
                    <div className={`w-full h-full duration-500 preserve-3d absolute ${cell.isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* FRONT */}
                        <div className="absolute inset-0 backface-hidden bg-white border-4 border-sky-300 rounded-2xl shadow-lg flex items-center justify-center p-2 transform transition-transform group-hover:scale-105">
                            <span className="text-center font-display font-bold text-sky-600 text-sm sm:text-lg md:text-xl break-words leading-tight select-none">
                                {cell.word}
                            </span>
                        </div>

                        {/* BACK */}
                        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl shadow-lg flex items-center justify-center text-4xl sm:text-5xl
                            ${cell.type === 'bomb' ? 'bg-red-100 border-4 border-red-400' : 'bg-green-100 border-4 border-green-400'}
                        `}>
                            <span className={cell.isFlipped ? (cell.type === 'bomb' ? 'animate-bounce' : 'animate-[pop_0.5s_ease-out_reverse]') : ''}>
                                {cell.type === 'bomb' ? '💣' : '🌸'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <p className="text-sky-700/80 font-bold text-center">
            Find the flowers! Beware the hidden bomb!
        </p>
      </div>
    </div>
  );
};

const CloudIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.5,19c-0.83,0-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5c0.83,0,1.5,0.67,1.5,1.5C19,18.33,18.33,19,17.5,19z M19,8.5 c-3.03,0-5.5,2.47-5.5,5.5c0,0.51,0.08,1,0.21,1.47C13.23,15.15,12.63,15,12,15c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3 c0-0.34-0.07-0.66-0.18-0.96C15.93,18.39,17.91,19,20,19c2.21,0,4-1.79,4-4S22.21,11,20,11C19.68,11,19.37,11.04,19.08,11.11 C19.04,9.65,18.17,8.5,19,8.5z M6,12c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4S8.21,12,6,12z" />
  </svg>
);

export default GridGameScreen;