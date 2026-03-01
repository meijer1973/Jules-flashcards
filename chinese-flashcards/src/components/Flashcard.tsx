import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, RefreshCw } from 'lucide-react';
import type { Flashcard as FlashcardType, CardSide } from '../types';
import { useStore } from '../store/useStore';

interface FlashcardProps {
  card: FlashcardType;
  onResult: (success: boolean, answerTimeSecs: number) => void;
}

export function Flashcard({ card, onResult }: FlashcardProps) {
  const { state } = useStore();
  const { settings } = state;

  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [elapsedSecs, setElapsedSecs] = useState<number>(0);

  // Deriving the font class directly in render ensures it only updates when card/settings change
  // without triggering a re-render from an effect.
  const randomFontClass = useMemo(() => {
    if (settings.useStylizedFonts) {
      const fonts = ['font-sc-sans', 'font-sc-serif', 'font-sc-zhi', 'font-sc-ma'];
      // Use string char codes of card.id to make it pseudo-random but deterministic
      // so it passes the linter rules regarding Math.random() in render.
      let sum = 0;
      for (let i = 0; i < card.id.length; i++) {
        sum += card.id.charCodeAt(i);
      }
      return fonts[sum % fonts.length];
    }
    return 'font-sc-sans';
  }, [card.id, settings.useStylizedFonts]);

  // Use a key change on the component to reset state, avoiding effect resets.
  // However, if we must reset state locally on props change, we do it in render:
  const [prevCardId, setPrevCardId] = useState(card.id);
  if (card.id !== prevCardId) {
    setPrevCardId(card.id);
    setIsFlipped(false);
    // eslint-disable-next-line react-hooks/purity
    setStartTime(Date.now());
    setElapsedSecs(0);
  }

  // Timer tick
  useEffect(() => {
    if (isFlipped) return;

    const timer = setInterval(() => {
      setElapsedSecs(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    return () => clearInterval(timer);
  }, [isFlipped, startTime]);

  const speak = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(card.hanzi);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const renderSideContent = (sides: CardSide[]) => {
    return sides.map((side) => {
      if (side === 'hanzi') {
        return (
          <div key={side} className={`text-6xl md:text-8xl mb-4 text-[#333333] ${randomFontClass} tracking-widest text-center`}>
            {card.hanzi}
          </div>
        );
      }
      if (side === 'pinyin') {
        return <div key={side} className="text-2xl text-gray-600 mb-2 font-sc-sans">{card.pinyin}</div>;
      }
      if (side === 'meaning') {
        return <div key={side} className="text-xl font-medium text-[#D22B2B] font-sc-sans">{card.meaning}</div>;
      }
      return null;
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">

      {/* Top Bar with Timer and TTS */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={speak}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors text-gray-700"
            title="Pronounce"
          >
            <Volume2 size={24} />
          </button>
        </div>
        <div className="text-gray-500 font-mono text-lg bg-white px-3 py-1 rounded-md shadow-sm border border-[#E5E0D8]">
          {elapsedSecs}s
        </div>
      </div>

      {/* Card Body */}
      <div
        onClick={handleFlip}
        className={`w-full bg-white border border-[#E5E0D8] rounded-xl shadow-lg p-8 min-h-[300px] flex flex-col justify-center items-center cursor-pointer transition-all duration-300 relative ${!isFlipped ? 'hover:shadow-xl hover:-translate-y-1' : ''}`}
      >
        {!isFlipped ? (
          <div className="flex flex-col items-center">
            {renderSideContent(settings.frontSides)}
            <div className="absolute bottom-4 text-gray-400 text-sm flex items-center">
              <RefreshCw size={14} className="mr-1" /> Tap to flip
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-200">
            {/* Front content repeated but smaller, optionally */}
            <div className="opacity-50 scale-75 mb-4 pointer-events-none">
              {renderSideContent(settings.frontSides)}
            </div>

            <div className="w-full border-t border-dashed border-[#E5E0D8] my-4"></div>

            {renderSideContent(settings.backSides)}
          </div>
        )}
      </div>

      {/* Actions */}
      {isFlipped && (
        <div className="w-full grid grid-cols-2 gap-4 mt-6 animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => onResult(false, elapsedSecs)}
            className="py-4 bg-white border-2 border-red-500 text-red-600 rounded-lg font-bold text-lg hover:bg-red-50 transition-colors shadow-sm"
          >
            Fail (Hard)
          </button>
          <button
            onClick={() => onResult(true, elapsedSecs)}
            className="py-4 bg-[#00A36C] border-2 border-[#00A36C] text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            Pass ({elapsedSecs}s)
          </button>
        </div>
      )}
    </div>
  );
}
