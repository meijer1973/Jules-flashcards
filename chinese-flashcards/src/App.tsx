import { useState } from 'react';
import { Layout } from './components/Layout';
// Using placeholders until components are implemented
import { Settings } from './components/Settings';
import { Import } from './components/Import';
import { Study } from './components/Study';
import { PrintView } from './components/PrintView';

function App() {
  const [activeTab, setActiveTab] = useState('study');

  const renderContent = () => {
    switch (activeTab) {
      case 'study':
        return <Study />;
      case 'import':
        return <Import />;
      case 'print':
        return <PrintView />;
      case 'settings':
        return <Settings />;
      default:
        return <Study />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
