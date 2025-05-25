import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, File as FilePdf, FileText as FileText2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes: string;
  currentFile: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  acceptedFileTypes,
  currentFile 
}) => {
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setError('');
    onFileUpload(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    onFileUpload(null as unknown as File);
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) {
      return <FilePdf className="h-10 w-10 text-red-500" />;
    } else if (filename.endsWith('.docx')) {
      return <FileText2 className="h-10 w-10 text-blue-500" />;
    }
    return <FileText className="h-10 w-10 text-gray-500" />;
  };

  return (
    <div>
      {!currentFile ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-300 ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg text-gray-700 mb-2">
              {isDragActive
                ? 'Drop your resume here...'
                : 'Drag & drop your resume here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX (Max 5MB)
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getFileIcon(currentFile.name)}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{currentFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(currentFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-red-500 transition-colors duration-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;