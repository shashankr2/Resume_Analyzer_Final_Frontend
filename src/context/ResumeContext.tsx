import React, { createContext, useContext, useState } from 'react';

type AnalysisResult = {
  id: string;
  score: number;
  keywords: string[];
  missingKeywords: string[];
  skills: {
    present: string[];
    missing: string[];
  };
  improvements: string[];
  atsCompatibility: number;
};

type ResumeContextType = {
  currentFile: File | null;
  setCurrentFile: (file: File | null) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  analysisHistory: AnalysisResult[];
  addToHistory: (result: AnalysisResult) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);

  const addToHistory = (result: AnalysisResult) => {
    setAnalysisHistory((prev) => [result, ...prev]);
  };

  return (
    <ResumeContext.Provider
      value={{
        currentFile,
        setCurrentFile,
        jobDescription,
        setJobDescription,
        analysisResult,
        setAnalysisResult,
        isAnalyzing,
        setIsAnalyzing,
        analysisHistory,
        addToHistory,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};