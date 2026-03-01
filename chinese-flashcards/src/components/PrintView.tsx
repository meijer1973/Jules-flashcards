import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Printer } from 'lucide-react';

export function PrintView() {
  const { state } = useStore();
  const { cards } = state;
  const [selectedSteps, setSelectedSteps] = useState<number[]>([]);

  // Get unique steps available in the deck
  const availableSteps = useMemo(() => {
    const steps = new Set(cards.map(c => c.srsStep));
    return Array.from(steps).sort((a, b) => a - b);
  }, [cards]);

  const handleToggleStep = (step: number) => {
    setSelectedSteps(prev =>
      prev.includes(step)
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  };

  const cardsToPrint = useMemo(() => {
    if (selectedSteps.length === 0) return cards;
    return cards.filter(c => selectedSteps.includes(c.srsStep));
  }, [cards, selectedSteps]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E0D8] print:hidden">
        <h2 className="text-2xl font-sc-serif font-bold text-[#D22B2B] mb-4">Print Flashcards</h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Select which SRS steps to print. Leave empty to print all cards.</p>
          <div className="flex flex-wrap gap-2">
            {availableSteps.map(step => (
              <button
                key={step}
                onClick={() => handleToggleStep(step)}
                className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors ${
                  selectedSteps.includes(step)
                    ? 'bg-[#F2D252] text-[#D22B2B] border-[#D22B2B]'
                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Step {step} ({cards.filter(c => c.srsStep === step).length})
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-[#E5E0D8] pt-4">
          <span className="text-gray-600">
            <strong>{cardsToPrint.length}</strong> cards selected for printing.
          </span>
          <button
            onClick={handlePrint}
            disabled={cardsToPrint.length === 0}
            className="flex items-center space-x-2 bg-[#D22B2B] text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={18} />
            <span>Print Cards</span>
          </button>
        </div>
      </div>

      {/* Print Layout */}
      <div className="hidden print:block print:bg-white print:p-0 w-full">
        <div className="grid grid-cols-2 gap-0 border-l border-t border-black w-[100%] max-w-[800px] mx-auto page-break-inside-avoid">
          {cardsToPrint.map((card, index) => (
            <div key={`${card.id}-front`} className="border-r border-b border-black p-4 flex flex-col justify-center items-center aspect-[3/2] page-break-inside-avoid text-center relative break-inside-avoid">
              <span className="text-5xl font-sc-sans mb-2 tracking-widest">{card.hanzi}</span>
              <span className="text-sm text-gray-400 absolute bottom-2 right-2">Front - {index + 1}</span>
            </div>
          ))}
        </div>

        <div className="print:page-break-before-always my-8 hidden print:block text-center text-xs text-gray-400">--- Flip Page ---</div>

        <div className="grid grid-cols-2 gap-0 border-l border-t border-black w-[100%] max-w-[800px] mx-auto page-break-inside-avoid" dir="rtl">
          {cardsToPrint.map((card, index) => (
             <div key={`${card.id}-back`} className="border-r border-b border-black p-4 flex flex-col justify-center items-center aspect-[3/2] page-break-inside-avoid text-center relative break-inside-avoid" dir="ltr">
              <span className="text-xl mb-1 text-gray-800 font-sc-sans">{card.pinyin}</span>
              <span className="text-lg font-bold text-[#D22B2B] font-sc-sans">{card.meaning}</span>
              <span className="text-sm text-gray-400 absolute bottom-2 right-2">Back - {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
