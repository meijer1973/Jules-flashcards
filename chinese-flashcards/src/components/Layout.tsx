import type { ReactNode } from 'react';
import { BookOpen, Upload, Settings as SettingsIcon, Printer } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const tabs = [
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'import', label: 'Import', icon: Upload },
    { id: 'print', label: 'Print', icon: Printer },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sc-sans text-[#333333] flex flex-col">
      <header className="bg-[#D22B2B] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-sc-serif tracking-wider">
            汉语学 - Hanzi Learn
          </h1>
          <nav className="flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#F2D252] text-[#D22B2B] font-bold'
                      : 'hover:bg-white/20'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>

      <footer className="border-t border-[#E5E0D8] bg-white py-4 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          Chinese Flashcards SRS &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
