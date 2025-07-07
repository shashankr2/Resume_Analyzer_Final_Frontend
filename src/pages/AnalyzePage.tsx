import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Briefcase, ArrowRight } from 'lucide-react';
import { useResumeContext } from '../context/ResumeContext.tsx';
import FileUploader from '../components/FileUploader.tsx';

const AnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentFile, 
    setCurrentFile, 
    jobDescription, 
    setJobDescription, 
    setIsAnalyzing,
    setAnalysisResult, 
    addToHistory 
  } = useResumeContext();
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (file: File) => {
    setCurrentFile(file);
    setActiveStep(2);
    setError('');
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentFile) {
    setError('Please upload a resume file');
    setActiveStep(1);
    return;
    }

    if (!jobDescription.trim()) {
    setError('Please enter a job description');
    return;
    }

    setIsLoading(true);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", currentFile);
      formData.append("job_description", jobDescription);

      const response = await fetch("https://resume-analyzer-final-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

    const contentType = response.headers.get("Content-Type");
  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error("Unexpected response:", text);
    throw new Error("Unexpected response from server");
  }

  if (!response.ok) {
    console.error("Backend error:", data);
    throw new Error("Server error");
  }

  const analysisId = Math.random().toString(36).substring(2, 9); // Optional
   const formattedResult = {
    id: analysisId,
    score: data.score || 0,
    keywords: data.keywords || [],
    missingKeywords: data.missing_keywords || [],
    skills: {
      present: data.strengths || [],
      missing: data.weaknesses || []
    },
    improvements: data.improvement_tips || [],
    atsCompatibility: data.score || 0, // Using the same score for ATS compatibility or you can adjust as needed
  };


   setAnalysisResult(formattedResult);
   addToHistory(formattedResult);
   setIsLoading(false);
   setIsAnalyzing(false);
   navigate(`/results/${analysisId}`);
    }catch (err: any) {
      console.error("❌ Error during analysis:", err);

    if (err instanceof Error) {
      setError(`Error: ${err.message}`);
    } else {
      setError("An unknown error occurred.");
    }

    setIsLoading(false);
    setIsAnalyzing(false);
  }

  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Analyze Your Resume</h1>
          <p className="text-xl text-gray-600">
            Upload your resume and provide a job description to get personalized feedback.
          </p>
        </div>

        {/* Steps Progress */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
          
          <StepIndicator 
            number={1} 
            title="Upload Resume" 
            isActive={activeStep === 1} 
            isCompleted={activeStep > 1} 
          />
          
          <StepIndicator 
            number={2} 
            title="Job Description" 
            isActive={activeStep === 2} 
            isCompleted={activeStep > 2} 
          />
          
          <StepIndicator 
            number={3} 
            title="Analysis" 
            isActive={activeStep === 3} 
            isCompleted={activeStep > 3} 
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Upload Resume */}
        {activeStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold">Upload Your Resume</h2>
              </div>
              
              <FileUploader 
                onFileUpload={handleFileUpload} 
                acceptedFileTypes=".pdf,.docx" 
                currentFile={currentFile}
              />

              {currentFile && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors duration-300"
                  >
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Job Description */}
        {activeStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-semibold">Add Job Description</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Paste the job description you're applying for
                  </label>
                  <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 h-64 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste job description here..."
                  ></textarea>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                  >
                    Back to Upload
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white px-6 py-3 rounded-md transition-colors duration-300`}
                  >
                    {isLoading ? (
                      <>Analyzing<span className="ml-2 loading-dots">...</span></>
                    ) : (
                      <>Analyze Resume <Upload className="ml-2 h-4 w-4" /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ number, title, isActive, isCompleted }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-500';
  
  if (isActive) {
    bgColor = 'bg-blue-600';
    textColor = 'text-blue-600';
  } else if (isCompleted) {
    bgColor = 'bg-green-500';
    textColor = 'text-green-600';
  }
  
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold mb-2`}>
        {number}
      </div>
      <div className={`text-sm font-medium ${textColor}`}>{title}</div>
    </div>
  );
};

export default AnalyzePage;
