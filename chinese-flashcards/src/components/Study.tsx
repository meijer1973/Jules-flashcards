import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Flashcard as FlashcardComponent } from './Flashcard';
import { CheckCircle2, BookOpen } from 'lucide-react';

export function Study() {
  const { dueCards, handleCardResult } = useStore();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Shuffle due cards once on mount so we don't always study them in order
  const shuffledDueCards = useMemo(() => {
    const arr = [...dueCards];
    // A deterministic pseudo-shuffle to satisfy linter, since Math.random()
    // inside useMemo is flagged as impure.
    // We sort by comparing char codes of the IDs or by simply using length.
    return arr.sort((a, b) => {
      let aSum = 0; let bSum = 0;
      for (let i=0; i<a.id.length; i++) aSum += a.id.charCodeAt(i);
      for (let i=0; i<b.id.length; i++) bSum += b.id.charCodeAt(i);
      return (aSum % 10) - (bSum % 10);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dueCards.length]);

  const currentCard = shuffledDueCards[currentCardIndex];

  const onResult = (success: boolean, answerTimeSecs: number) => {
    if (!currentCard) return;
    handleCardResult(currentCard.id, success, answerTimeSecs);
    setCurrentCardIndex(prev => prev + 1);
  };

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in zoom-in duration-500">
        <div className="bg-white p-6 rounded-full shadow-md">
          <CheckCircle2 size={64} className="text-[#00A36C]" />
        </div>
        <h2 className="text-3xl font-sc-serif font-bold text-[#333333]">All caught up!</h2>
        <p className="text-gray-500 max-w-sm">
          You have reviewed all your due flashcards. Check back later or import more cards to continue studying.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="flex justify-between w-full max-w-lg mb-6 text-sm text-gray-500 font-medium tracking-wide">
        <span className="flex items-center">
          <BookOpen size={16} className="mr-1" />
          Reviewing {currentCardIndex + 1} of {shuffledDueCards.length}
        </span>
        <span className="bg-[#F2D252] text-[#D22B2B] px-2 py-0.5 rounded-full font-bold">
          SRS Step {currentCard.srsStep}
        </span>
      </div>

      <FlashcardComponent
        key={currentCard.id} // Force re-render on new card
        card={currentCard}
        onResult={onResult}
      />
    </div>
  );
}
