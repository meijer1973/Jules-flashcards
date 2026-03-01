export type CardSide = 'meaning' | 'pinyin' | 'hanzi';

export interface SrsStep {
  step: number;
  timeLimitSecs: number | null; // null for step 0
  intervalHours: number;
}

export interface Flashcard {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;

  srsStep: number;
  nextReviewTime: number; // Unix timestamp
}

export interface AppSettings {
  frontSides: CardSide[];
  backSides: CardSide[];
  useStylizedFonts: boolean;
  srsSteps: SrsStep[];
  infiniteStepMultiplier: number;
}

export interface AppState {
  cards: Flashcard[];
  settings: AppSettings;
}
