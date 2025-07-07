import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import AnalyzePage from './pages/AnalyzePage.tsx';
import ResultsPage from './pages/ResultsPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import { ResumeProvider } from './context/ResumeContext.tsx';

function App() {
  return (
    <ResumeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/results/:id" element={<ResultsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ResumeProvider>
  );
}

export default App;