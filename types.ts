export interface WordPair {
  english: string;
  chinese: string;
}

export enum BalloonStatus {
  NORMAL = 'NORMAL',
  SELECTED = 'SELECTED',
  MATCHED = 'MATCHED', // Popping state
  MISMATCH = 'MISMATCH', // Shaking state
  POPPED = 'POPPED', // Gone
}

export interface BalloonData {
  id: string;
  text: string;
  type: 'english' | 'chinese';
  matchId: string; // The ID of the balloon that matches this one (technically the word pair ID)
  status: BalloonStatus;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  color: string; // Tailwind color class stub (e.g., 'red', 'blue')
  floatDelay: number; // Random delay for float animation
  floatDuration: number; // Random duration
}

export enum GameState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
}

export enum GameMode {
  BALLOON = 'BALLOON',
  GRID = 'GRID',
}