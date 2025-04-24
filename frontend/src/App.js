import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { PublicRoute } from './components/shared/PublicRoute';
import { Layout } from './components/shared/Layout';
import { DashboardLayout } from './components/shared/DashboardLayout'; // New layout for dashboard
import { Home } from './pages/Public/Home';
import { PublicPortfolio } from './pages/Public/PublicPortfolio';
import { PublicCaseStudy } from './pages/Public/PublicCaseStudy';
import { AuthLogin } from './pages/Auth/AuthLogin';
import { AuthRegister } from './pages/Auth/AuthRegister';
import { DashboardHome } from './pages/Dashboard/DashboardHome';
import { PortfolioEditor } from './pages/Dashboard/PortfolioEditor';
import { CaseStudyList } from './pages/CaseStudy/CaseStudyList';
import { CaseStudyEditor } from './pages/CaseStudy/CaseStudyEditor';
import { AnalyticsDashboard } from './pages/Analytics/AnalyticsDashboard';
import { NotFound } from './pages/NotFound';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Layout (shared header/footer) */}
        <Route >
          {/* Public routes */}
          <Route path="/" >
            <Route index element={<Home />} />
            <Route path=":username" element={<PublicPortfolio />} />
            <Route path=":username/:slug" element={<PublicCaseStudy />} />
          </Route>

          {/* Auth routes */}
          <Route path="/auth" >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Dashboard Layout (different from main layout) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } >
          <Route index element={<DashboardHome />} />
          <Route path="portfolio" element={<PortfolioEditor />} />
          <Route path="case-studies" element={<CaseStudyList />} />
          <Route path="case-studies/new" element={<CaseStudyEditor />} />
          <Route path="case-studies/:id" element={<CaseStudyEditor />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;