import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Download, Share2, CheckCircle, XCircle, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { useResumeContext } from '../context/ResumeContext';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { analysisResult, currentFile } = useResumeContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!analysisResult) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Analysis Result Not Found</h2>
        <p className="text-gray-600 mb-8">The analysis result you're looking for might have expired or doesn't exist.</p>
        <Link
          to="/analyze"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
        >
          Start New Analysis
        </Link>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };

  // Chart data for the doughnut chart
  const scoreData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [analysisResult.score, 100 - analysisResult.score],
        backgroundColor: [
          analysisResult.score >= 85 
            ? '#10B981' 
            : analysisResult.score >= 70 
              ? '#F59E0B' 
              : '#EF4444',
          '#EEF2F6'
        ],
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  };

  // Chart data for the radar chart
  const radarData = {
    labels: ['ATS Compatibility', 'Keyword Match', 'Skills Match', 'Format & Structure', 'Content Quality'],
    datasets: [
      {
        label: 'Your Resume',
        data: [
          analysisResult.atsCompatibility,
          Math.floor(70 + Math.random() * 20), // Random score between 70-90
          Math.floor(100 * analysisResult.skills.present.length / (analysisResult.skills.present.length + analysisResult.skills.missing.length)),
          Math.floor(75 + Math.random() * 20), // Random score between 75-95
          Math.floor(65 + Math.random() * 30), // Random score between 65-95
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          showLabelBackdrop: false,
          font: {
            size: 10,
          },
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">Resume Analysis Results</h1>
              {currentFile && (
                <span className="ml-4 text-sm text-gray-500">
                  {currentFile.name}
                </span>
              )}
            </div>
            <p className="text-gray-600">Analysis ID: {id}</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-300">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-300">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <TabButton 
              label="Overview" 
              isActive={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <TabButton 
              label="Keywords" 
              isActive={activeTab === 'keywords'} 
              onClick={() => setActiveTab('keywords')} 
            />
            <TabButton 
              label="Skills" 
              isActive={activeTab === 'skills'} 
              onClick={() => setActiveTab('skills')} 
            />
            <TabButton 
              label="Improvements" 
              isActive={activeTab === 'improvements'} 
              onClick={() => setActiveTab('improvements')} 
            />
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Score Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
                <div className="flex justify-center mb-4 relative">
                  <div className="w-40 h-40">
                    <Doughnut data={scoreData} options={{ cutout: '80%', plugins: { legend: { display: false } } }} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className={`text-3xl font-bold ${getScoreColor(analysisResult.score)}`}>
                        {analysisResult.score}%
                      </span>
                      <span className="text-sm text-gray-500">{getScoreLabel(analysisResult.score)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Your resume is {getScoreLabel(analysisResult.score).toLowerCase()} for this job position.
                </p>
              </div>

              {/* ATS Compatibility */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">ATS Compatibility</h3>
                <div className={`rounded-full h-20 flex items-center justify-center ${getScoreBackgroundColor(analysisResult.atsCompatibility)}`}>
                  <span className={`text-3xl font-bold ${getScoreColor(analysisResult.atsCompatibility)}`}>
                    {analysisResult.atsCompatibility}%
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {analysisResult.atsCompatibility >= 80
                    ? 'Your resume is well-structured for ATS systems.'
                    : 'Your resume may need formatting improvements for better ATS compatibility.'}
                </p>
              </div>

              {/* Match Summary */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Match Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Keywords Match</span>
                    <span className="font-semibold">
                      {analysisResult.keywords.length}/{analysisResult.keywords.length + analysisResult.missingKeywords.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.round(100 * analysisResult.keywords.length / (analysisResult.keywords.length + analysisResult.missingKeywords.length))}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Skills Match</span>
                    <span className="font-semibold">
                      {analysisResult.skills.present.length}/{analysisResult.skills.present.length + analysisResult.skills.missing.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.round(100 * analysisResult.skills.present.length / (analysisResult.skills.present.length + analysisResult.skills.missing.length))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
              <div className="h-80">
                <Radar data={radarData} options={chartOptions} />
              </div>
            </div>

            {/* Improvements Quick Overview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Key Improvements</h3>
              <ul className="space-y-3">
                {analysisResult.improvements.slice(0, 3).map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowUp className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{improvement}</span>
                  </li>
                ))}
                {analysisResult.improvements.length > 3 && (
                  <li className="text-center mt-4">
                    <button 
                      onClick={() => setActiveTab('improvements')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all improvements →
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold">Found Keywords</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  These keywords were found in your resume and match the job description.
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold">Missing Keywords</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Consider adding these keywords to your resume to better match the job description.
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingKeywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">How to Use Keywords Effectively</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Incorporate keywords naturally throughout your resume, especially in your skills section and work experiences.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>Use exact matches for technical skills and industry-specific terminology.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>Include both the spelled-out term and acronym when applicable (e.g., "Artificial Intelligence (AI)").</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span>Don't force keywords that aren't relevant to your experience - focus on the ones that genuinely match your skills.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold">Present Skills</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  These skills were found in your resume and are relevant to the position.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {analysisResult.skills.present.map((skill, index) => (
                    <div 
                      key={index}
                      className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold">Missing Skills</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Consider highlighting or developing these skills that are important for the position.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {analysisResult.skills.missing.map((skill, index) => (
                    <div 
                      key={index}
                      className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center"
                    >
                      <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Skills Development Recommendations</h3>
              <div className="space-y-4">
                {analysisResult.skills.missing.slice(0, 3).map((skill, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-medium mb-2">{skill}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {index === 0 
                        ? `Consider taking online courses or certifications in ${skill} to enhance your resume.` 
                        : index === 1 
                          ? `If you have any experience with ${skill}, even in personal projects, be sure to highlight it.` 
                          : `Adding ${skill} to your skill set would significantly improve your match for this position.`}
                    </p>
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(`learn ${skill} courses`)}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Find learning resources →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Improvements Tab */}
        {activeTab === 'improvements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-6">Recommended Improvements</h3>
              <div className="space-y-6">
                {analysisResult.improvements.map((improvement, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <ArrowUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-lg mb-2">
                        {improvement}
                      </h4>
                      <p className="text-gray-600">
                        {index === 0 
                          ? "Use specific numbers and metrics to demonstrate your impact. For example, 'Increased sales by 15%' is more effective than 'Increased sales'."
                          : index === 1 
                            ? "If you have relevant skills that weren't mentioned in your resume, be sure to add them, especially those mentioned in the job description."
                            : index === 2 
                              ? "Tailor your professional summary to specifically address the requirements in this job description."
                              : "Technical skills are highly valued in this role. Be sure to list all relevant technologies you've worked with."}
                      </p>
                      <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <h5 className="text-sm font-medium mb-2">Example:</h5>
                        <p className="text-sm text-gray-600">
                          {index === 0 
                            ? "Before: 'Led a team to improve application performance.'\nAfter: 'Led a 5-person engineering team that improved application performance by 40%, resulting in a 25% increase in user retention.'"
                            : index === 1 
                              ? "Before: 'Skilled in front-end development.'\nAfter: 'Skilled in front-end development with React.js, TypeScript, and responsive design principles.'"
                              : index === 2 
                                ? "Before: 'Experienced software developer with a track record of success.'\nAfter: 'Results-driven software developer with 5 years of experience building scalable web applications using React and Node.js, seeking to leverage my skills in Python and Flask to drive technical innovation at [Company Name].'"
                                : "Before: 'Experience with databases.'\nAfter: 'Experience with SQL and NoSQL databases including PostgreSQL, MongoDB, and Redis for high-performance data storage and retrieval.'"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Next Steps</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 font-medium mr-3 flex-shrink-0">
                    1
                  </div>
                  <p>Update your resume with the suggested improvements</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 font-medium mr-3 flex-shrink-0">
                    2
                  </div>
                  <p>Re-upload your revised resume for a new analysis</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-blue-800 font-medium mr-3 flex-shrink-0">
                    3
                  </div>
                  <p>Aim for an overall score of 85% or higher before applying</p>
                </li>
              </ul>
              <div className="mt-6">
                <Link
                  to="/analyze"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md inline-block transition-colors duration-300"
                >
                  Start New Analysis
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    className={`py-4 font-medium border-b-2 transition-colors duration-300 ${
      isActive
        ? 'text-blue-600 border-blue-600'
        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default ResultsPage;