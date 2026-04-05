import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import CareerDetailPage from './pages/CareerDetailPage';
import ChatPage from './pages/ChatPage';
import CollegeFinderPage from './pages/CollegeFinderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/career/:id" element={<CareerDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/college-finder" element={<CollegeFinderPage />} />
      </Routes>
    </BrowserRouter>
  );
}
