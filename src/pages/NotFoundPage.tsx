import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <FileQuestion className="h-24 w-24 text-blue-400 mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-center">Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-md">
        The page you're looking for doesn't seem to exist or may have been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;