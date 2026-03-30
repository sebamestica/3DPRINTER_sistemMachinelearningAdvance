import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AdvancedLabPage } from './pages/lab/AdvancedLabPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lab" element={<AdvancedLabPage />} />
    </Routes>
  );
}

export default App;
