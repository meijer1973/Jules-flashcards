import { useState } from 'react';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useStore';
import type { Flashcard } from '../types';

export function Import() {
  const { addCards } = useStore();
  const [csvText, setCsvText] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const handleImport = () => {
    if (!csvText.trim()) {
      setStatus({ type: 'error', message: 'Please paste some CSV data first.' });
      return;
    }

    Papa.parse<{ hanzi: string, pinyin: string, meaning: string }>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validCards = results.data.filter(row => row.hanzi && row.pinyin && row.meaning);

        if (validCards.length === 0) {
          setStatus({ type: 'error', message: 'No valid rows found. Ensure you have "hanzi", "pinyin", and "meaning" column headers.' });
          return;
        }

        const newCards: Flashcard[] = validCards.map(row => ({
          id: uuidv4(),
          hanzi: row.hanzi.trim(),
          pinyin: row.pinyin.trim(),
          meaning: row.meaning.trim(),
          srsStep: 0,
          nextReviewTime: Date.now() - 1000, // Due immediately
        }));

        addCards(newCards);
        setCsvText('');
        setStatus({ type: 'success', message: `Successfully imported ${newCards.length} flashcards!` });
      },
      error: (error: Error) => {
        setStatus({ type: 'error', message: `CSV Parsing Error: ${error.message}` });
      }
    });
  };

  const handleLoadSample = () => {
    setCsvText(`hanzi,pinyin,meaning\n你好,nǐ hǎo,hello\n谢谢,xiè xie,thank you\n再见,zài jiàn,goodbye\n水,shuǐ,water\n中国,Zhōng guó,China`);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E0D8] space-y-6">
      <h2 className="text-2xl font-sc-serif font-bold text-[#D22B2B]">Import Flashcards</h2>

      <p className="text-gray-600">
        Paste your CSV data below. The first row must contain headers exactly named: <code className="bg-gray-100 px-1 py-0.5 rounded">hanzi</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">pinyin</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">meaning</code>.
      </p>

      {status && (
        <div className={`p-4 rounded-md ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {status.message}
        </div>
      )}

      <textarea
        className="w-full h-64 p-4 border border-[#E5E0D8] rounded-md focus:ring-2 focus:ring-[#D22B2B] focus:border-transparent outline-none font-mono text-sm"
        placeholder="hanzi,pinyin,meaning&#10;你好,nǐ hǎo,hello"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleLoadSample}
          className="text-[#D22B2B] hover:text-red-700 underline text-sm"
        >
          Load sample data
        </button>
        <button
          onClick={handleImport}
          className="bg-[#D22B2B] text-white px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors shadow-sm"
        >
          Import Data
        </button>
      </div>
    </div>
  );
}
