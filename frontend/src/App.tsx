import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdvancedLabPage } from './pages/AdvancedLabPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/advanced" element={<AdvancedLabPage />} />
    </Routes>
  );
}

export default App;
