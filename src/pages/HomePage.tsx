import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Award, FileCheck } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-8 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Optimize Your Resume with AI
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Get instant feedback, beat the ATS systems, and land more interviews with our advanced resume analysis.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/analyze"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-center transition-colors duration-300"
                >
                  Analyze Resume
                </Link>
                <Link
                  to="/features"
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 rounded-lg font-medium text-center transition-colors duration-300"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2"
            >
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Resume Analysis"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use ResumeAI?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform analyzes your resume against job descriptions to maximize your chances of landing interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FileCheck className="h-12 w-12 text-blue-600" />}
              title="ATS Compatibility"
              description="Ensure your resume passes through Applicant Tracking Systems with our ATS optimization tools."
            />
            <FeatureCard
              icon={<CheckCircle className="h-12 w-12 text-green-600" />}
              title="Keyword Analysis"
              description="Identify missing keywords and phrases that are crucial for your target job positions."
            />
            <FeatureCard
              icon={<TrendingUp className="h-12 w-12 text-orange-600" />}
              title="Skills Gap Analysis"
              description="Discover skills you should highlight or develop to become a stronger candidate."
            />
            <FeatureCard
              icon={<Award className="h-12 w-12 text-purple-600" />}
              title="Custom Recommendations"
              description="Get personalized suggestions to improve your resume for specific job descriptions."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to optimize your resume and increase your interview chances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Upload Your Resume"
              description="Upload your resume in PDF or DOCX format. Our system will parse and analyze its content."
            />
            <StepCard
              number="2"
              title="Add Job Description"
              description="Paste the job description you're applying for to enable targeted analysis."
            />
            <StepCard
              number="3"
              title="Get Detailed Analysis"
              description="Receive comprehensive feedback and actionable improvements to optimize your resume."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Land More Interviews?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their resumes and boosted their career prospects with ResumeAI.
          </p>
          <Link
            to="/analyze"
            className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium inline-block transition-colors duration-300"
          >
            Analyze Your Resume Now
          </Link>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="bg-white rounded-xl p-8 shadow-md relative">
    <div className="absolute -top-5 -left-5 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-3 mt-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;