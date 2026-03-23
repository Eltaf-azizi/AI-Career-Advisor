import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import HomePage from './pages/HomePage';
import CareerComparisonPage from './pages/CareerComparisonPage';
import ResultsPage from './pages/ResultsPage';
import CareerDetailPage from './pages/CareerDetailPage';
import ChatPage from './pages/ChatPage';
import CareerPathsPage from './pages/CareerPathsPage';
import FieldDetailPage from './pages/FeildDetailPage';
import CareerDetailByName from './pages/CareerDetailByName';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<CareerComparisonPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/career/:id" element={<CareerDetailPage />} />
          <Route path="/career-paths" element={<CareerPathsPage />} />
          <Route path="/career-paths/:fieldName" element={<FieldDetailPage />} />
          <Route path="/career-detail-by-name/:careerName" element={<CareerDetailByName />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
