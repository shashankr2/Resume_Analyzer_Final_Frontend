import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useResumeContext } from '../context/ResumeContext';
import { FileText, AlertCircle, TrendingUp, FileBadge as FileBar, ChevronRight } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { analysisHistory } = useResumeContext();

  if (analysisHistory.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Analysis History</h2>
          <p className="text-gray-600 mb-8">
            You haven't analyzed any resumes yet. Start by uploading your resume to get personalized feedback.
          </p>
          <Link
            to="/analyze"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
          >
            Analyze Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Analysis History</h1>
          <Link
            to="/analyze"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
          >
            New Analysis
          </Link>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Average Score"
            value={`${Math.round(analysisHistory.reduce((sum, item) => sum + item.score, 0) / analysisHistory.length)}%`}
            icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
            trend={
              analysisHistory.length >= 2 && 
              analysisHistory[0].score > analysisHistory[1].score ? 'up' : 'down'
            }
          />
          <StatCard 
            title="ATS Compatibility"
            value={`${Math.round(analysisHistory.reduce((sum, item) => sum + item.atsCompatibility, 0) / analysisHistory.length)}%`}
            icon={<FileBar className="h-6 w-6 text-green-600" />}
            trend="neutral"
          />
          <StatCard 
            title="Total Analyses"
            value={analysisHistory.length.toString()}
            icon={<FileText className="h-6 w-6 text-purple-600" />}
            trend="neutral"
          />
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Analyses</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {analysisHistory.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                      analysis.score >= 85 ? 'bg-green-500' : 
                      analysis.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {analysis.score}%
                    </div>
                    <div>
                      <h3 className="font-semibold">Resume Analysis {analysis.id}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()} {/* Using current date for demo */}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {analysis.keywords.length} keywords
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {analysis.skills.present.length} skills
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {analysis.improvements.length} improvements
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/results/${analysis.id}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress Over Time (placeholder) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Improvement Over Time</h2>
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">
              Resume score history chart will appear here as you complete more analyses
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Track your resume's improvement over time as you implement our suggestions.
          </p>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
        {trend !== 'neutral' && (
          <div className={`flex items-center ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <>
                <span className="text-xs mr-1">+5%</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span className="text-xs mr-1">-3%</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardPage;