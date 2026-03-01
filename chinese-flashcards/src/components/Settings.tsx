import { useStore } from '../store/useStore';
import type { CardSide } from '../types';

export function Settings() {
  const { state, updateSettings } = useStore();
  const { settings } = state;

  const handleToggleSide = (side: CardSide, isFront: boolean) => {
    const list = isFront ? settings.frontSides : settings.backSides;
    let newList;
    if (list.includes(side)) {
      if (list.length === 1) return; // Must have at least one side
      newList = list.filter(s => s !== side);
    } else {
      newList = [...list, side];
    }

    if (isFront) updateSettings({ frontSides: newList });
    else updateSettings({ backSides: newList });
  };

  const handleSrsChange = (index: number, field: 'timeLimitSecs' | 'intervalHours', value: string) => {
    const newSteps = [...settings.srsSteps];
    const numValue = value === '' ? null : Number(value);

    if (field === 'timeLimitSecs') {
      newSteps[index] = { ...newSteps[index], timeLimitSecs: numValue };
    } else {
      newSteps[index] = { ...newSteps[index], intervalHours: Number(value) };
    }

    updateSettings({ srsSteps: newSteps });
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-[#E5E0D8]">
      <h2 className="text-2xl font-sc-serif font-bold text-[#D22B2B]">Settings</h2>

      <section>
        <h3 className="text-xl font-bold mb-4 border-b border-[#E5E0D8] pb-2">Card Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Front Side</h4>
            <div className="space-y-2">
              {(['hanzi', 'pinyin', 'meaning'] as CardSide[]).map(side => (
                <label key={`front-${side}`} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.frontSides.includes(side)}
                    onChange={() => handleToggleSide(side, true)}
                    className="accent-[#D22B2B]"
                  />
                  <span className="capitalize">{side}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Back Side</h4>
            <div className="space-y-2">
              {(['hanzi', 'pinyin', 'meaning'] as CardSide[]).map(side => (
                <label key={`back-${side}`} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.backSides.includes(side)}
                    onChange={() => handleToggleSide(side, false)}
                    className="accent-[#D22B2B]"
                  />
                  <span className="capitalize">{side}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4 border-b border-[#E5E0D8] pb-2">Font Settings</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.useStylizedFonts}
            onChange={(e) => updateSettings({ useStylizedFonts: e.target.checked })}
            className="accent-[#D22B2B]"
          />
          <span>Use randomized stylized fonts (helps with real-world recognition)</span>
        </label>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4 border-b border-[#E5E0D8] pb-2">SRS Timing Configuration</h3>
        <div className="space-y-4">
          {settings.srsSteps.map((step, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 bg-gray-50 rounded-md">
              <span className="font-bold w-16">Step {step.step}</span>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Time Limit (s):</label>
                <input
                  type="number"
                  value={step.timeLimitSecs ?? ''}
                  onChange={(e) => handleSrsChange(index, 'timeLimitSecs', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-20"
                  placeholder="None"
                  disabled={index === 0}
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Interval (hrs):</label>
                <input
                  type="number"
                  value={step.intervalHours}
                  onChange={(e) => handleSrsChange(index, 'intervalHours', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-20"
                />
              </div>
            </div>
          ))}
          <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-gray-50 rounded-md mt-4">
            <span className="font-bold w-16 text-sm">Step 7+</span>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Infinite Multiplier:</label>
              <input
                type="number"
                step="0.1"
                value={settings.infiniteStepMultiplier}
                onChange={(e) => updateSettings({ infiniteStepMultiplier: Number(e.target.value) })}
                className="border border-gray-300 rounded px-2 py-1 w-20"
              />
            </div>
            <span className="text-sm text-gray-500 ml-4">Success within 1s required.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
