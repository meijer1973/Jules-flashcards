import { useState, useEffect } from 'react';
import type { AppState, Flashcard, AppSettings, SrsStep } from '../types';

export const DEFAULT_SRS_STEPS: SrsStep[] = [
  { step: 0, timeLimitSecs: null, intervalHours: 4 },
  { step: 1, timeLimitSecs: 8, intervalHours: 12 },
  { step: 2, timeLimitSecs: 3, intervalHours: 24 },
  { step: 3, timeLimitSecs: 2, intervalHours: 48 }, // 2 days
  { step: 4, timeLimitSecs: 1, intervalHours: 72 }, // 3 days
  { step: 5, timeLimitSecs: 1, intervalHours: 120 }, // 5 days
  { step: 6, timeLimitSecs: 1, intervalHours: 168 }, // 7 days
];

const DEFAULT_SETTINGS: AppSettings = {
  frontSides: ['hanzi'],
  backSides: ['pinyin', 'meaning'],
  useStylizedFonts: true,
  srsSteps: DEFAULT_SRS_STEPS,
  infiniteStepMultiplier: 2.0, // Multiplies the interval from step 6 for step 7+, etc.
};

const DEFAULT_STATE: AppState = {
  cards: [],
  settings: DEFAULT_SETTINGS,
};

const STORAGE_KEY = 'chinese_flashcards_state';

export function useStore() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge missing default settings in case of upgrades
        return {
          ...DEFAULT_STATE,
          ...parsed,
          settings: {
            ...DEFAULT_SETTINGS,
            ...parsed.settings,
          }
        };
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const addCards = (newCards: Flashcard[]) => {
    setState(prev => ({
      ...prev,
      cards: [...prev.cards, ...newCards]
    }));
  };

  const removeCard = (id: string) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== id)
    }));
  }

  const handleCardResult = (cardId: string, success: boolean, answerTimeSecs: number) => {
    setState(prev => {
      const cards = prev.cards.map(card => {
        if (card.id !== cardId) return card;

        let newStep = card.srsStep;

        if (!success) {
          // If fail, usually drop back to 0 or 1
          newStep = 0;
        } else {
          // It's a success, let's see if it was fast enough
          const currentStepRule = prev.settings.srsSteps.find(s => s.step === card.srsStep);
          let limit = currentStepRule?.timeLimitSecs;

          if (!currentStepRule) {
            // If the step is beyond the defined steps (e.g., Step 7+), use the time limit of the highest defined step.
            // Based on default settings and requirements, this is typically 1 second.
            const maxDefinedStep = prev.settings.srsSteps[prev.settings.srsSteps.length - 1];
            limit = maxDefinedStep.timeLimitSecs;
          }

          if (limit === null || limit === undefined || answerTimeSecs <= limit) {
            newStep += 1;
          }
          // If they took too long, step stays the same
        }

        // Calculate next review time
        let nextIntervalHours = 4; // fallback

        if (newStep < prev.settings.srsSteps.length) {
          const rule = prev.settings.srsSteps.find(s => s.step === newStep);
          if (rule) nextIntervalHours = rule.intervalHours;
        } else {
          // Infinite step math based on multiplier
          const maxDefinedStep = prev.settings.srsSteps[prev.settings.srsSteps.length - 1];
          const diff = newStep - maxDefinedStep.step;
          // E.g. step 7 = 7 days * 2.0^1 = 14 days
          // step 8 = 7 days * 2.0^2 = 28 days
          nextIntervalHours = maxDefinedStep.intervalHours * Math.pow(prev.settings.infiniteStepMultiplier, diff);
        }

        const nextReviewTime = Date.now() + (nextIntervalHours * 60 * 60 * 1000);

        return {
          ...card,
          srsStep: newStep,
          nextReviewTime,
        };
      });

      return { ...prev, cards };
    });
  };

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  return {
    state,
    updateSettings,
    addCards,
    removeCard,
    handleCardResult,
    dueCards: state.cards.filter(c => c.nextReviewTime <= now),
  };
}
