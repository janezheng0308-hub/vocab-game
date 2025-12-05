import React, { useState } from 'react';
import { generateTranslations, generateGridWords } from '../services/geminiService';
import { WordPair, GameMode } from '../types';

interface SetupScreenProps {
  onStartGame: (data: WordPair[] | string[], mode: GameMode) => void;
}

const DEFAULT_WORDS = "Apple, Banana, Cat, Dog, Elephant, Fish, Sun, Moon";

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [inputText, setInputText] = useState(DEFAULT_WORDS);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.BALLOON);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    const rawWords = inputText.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
    
    // Validation
    if (gameMode === GameMode.BALLOON) {
       if (rawWords.length < 2) {
          setError("Please enter at least 2 words.");
          return;
       }
       if (rawWords.length > 15) {
          setError("Too many words! Try 15 or less.");
          return;
       }
    } else {
        // Grid mode needs at least 1 word, we fill the rest
        if (rawWords.length < 1) {
            setError("Please enter at least 1 word.");
            return;
        }
    }

    setIsLoading(true);
    setError(null);

    try {
      if (gameMode === GameMode.BALLOON) {
        const pairs = await generateTranslations(rawWords);
        if (pairs.length === 0) {
          setError("Failed to generate translations. Please try again.");
        } else {
          onStartGame(pairs, GameMode.BALLOON);
        }
      } else {
        // Grid Mode
        const gridWords = await generateGridWords(rawWords);
        onStartGame(gridWords, GameMode.GRID);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-sky-200 to-sky-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center border-4 border-sky-300">
        <h1 className="text-4xl font-display font-bold text-sky-600 mb-2">Word Pop & Play</h1>
        <p className="text-gray-500 mb-6 font-semibold">Vocabulary Learning Games</p>

        {/* Game Mode Selector */}
        <div className="flex bg-sky-100 p-1 rounded-xl mb-6">
            <button 
                onClick={() => setGameMode(GameMode.BALLOON)}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${gameMode === GameMode.BALLOON ? 'bg-white text-sky-600 shadow-md' : 'text-gray-500 hover:text-sky-500'}`}
            >
                🎈 Balloons
            </button>
            <button 
                onClick={() => setGameMode(GameMode.GRID)}
                className={`flex-1 py-2 rounded-lg font-bold transition-all ${gameMode === GameMode.GRID ? 'bg-white text-sky-600 shadow-md' : 'text-gray-500 hover:text-sky-500'}`}
            >
                💣 Grid
            </button>
        </div>

        <div className="mb-6">
          <label className="block text-left text-gray-700 font-bold mb-2 ml-1">
            {gameMode === GameMode.BALLOON ? "Enter English Words to Match:" : "Enter Words for the Grid:"}
          </label>
          <textarea
            className="w-full h-32 p-4 rounded-xl border-2 border-sky-200 focus:border-sky-500 focus:outline-none bg-sky-50 text-gray-700 resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={gameMode === GameMode.BALLOON ? "e.g. Red, Blue, Green..." : "e.g. Apple, Ball... (We'll fill up to 9 words!)"}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm font-bold animate-pulse">
            {error}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={isLoading}
          className={`w-full py-4 rounded-full text-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600'}
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Preparing Game...
            </span>
          ) : (
            `Start ${gameMode === GameMode.BALLOON ? 'Balloon' : 'Grid'} Game!`
          )}
        </button>
      </div>
      
      <p className="mt-8 text-sky-700/60 text-sm font-semibold">
        Powered by Google Gemini
      </p>
    </div>
  );
};

export default SetupScreen;