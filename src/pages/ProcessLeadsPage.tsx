import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, Brain, BarChart3, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Layout } from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../services/leadService';
import { ProcessingStatus } from '../types';

export const ProcessLeadsPage: React.FC = () => {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    step: 'upload',
    progress: 0,
    message: 'Ready to upload leads file',
    isProcessing: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const processFile = async (file: File) => {
    setProcessingStatus({
      step: 'extract',
      progress: 10,
      message: 'Extracting data from file...',
      isProcessing: true,
    });

    // Simulate processing steps
    setTimeout(() => {
      setProcessingStatus({
        step: 'extract',
        progress: 40,
        message: 'Data extracted successfully. Preparing for AI analysis...',
        isProcessing: true,
      });
    }, 1000);

    setTimeout(() => {
      setProcessingStatus({
        step: 'analyze',
        progress: 70,
        message: 'AI is analyzing and scoring leads...',
        isProcessing: true,
      });
    }, 2000);

    setTimeout(async () => {
      try {
        const result = await leadService.processFile(file);
        setProcessingStatus({
          step: 'complete',
          progress: 100,
          message: `Successfully processed ${result.leadsCount} leads!`,
          isProcessing: false,
        });
      } catch (error) {
        setProcessingStatus({
          step: 'upload',
          progress: 0,
          message: 'Processing failed. Please try again.',
          isProcessing: false,
        });
      }
    }, 4000);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'upload':
        return <Upload className="h-6 w-6" />;
      case 'extract':
        return <FileText className="h-6 w-6" />;
      case 'analyze':
        return <Brain className="h-6 w-6" />;
      case 'complete':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Upload className="h-6 w-6" />;
    }
  };

  const steps = [
    { key: 'upload', label: 'Upload File', description: 'Select your CSV/Excel file' },
    { key: 'extract', label: 'Extract Data', description: 'Parse and validate data' },
    { key: 'analyze', label: 'AI Analysis', description: 'Score leads with AI' },
    { key: 'complete', label: 'Complete', description: 'Ready to view results' },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === processingStatus.step);
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Process New Leads</h1>
          <p className="text-gray-600">Upload your CSV or Excel file to start AI-powered lead scoring</p>
        </div>

        {/* Processing Steps */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-lg font-semibold">Processing Steps</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center relative">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      index <= getCurrentStepIndex()
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {getStepIcon(step.key)}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900">{step.label}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-6 left-12 w-24 h-0.5 transition-all duration-300 ${
                        index < getCurrentStepIndex()
                          ? 'bg-indigo-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {processingStatus.isProcessing && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{processingStatus.message}</span>
                  <span>{processingStatus.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingStatus.progress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Upload Area */}
        {processingStatus.step === 'upload' && (
          <Card>
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <FileSpreadsheet className="h-8 w-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isDragActive ? 'Drop your file here' : 'Upload leads file'}
                    </h3>
                    <p className="text-gray-500">
                      Drag and drop your CSV or Excel file, or{' '}
                      <span className="text-indigo-600 font-medium">browse files</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>✓ CSV files</span>
                    <span>✓ Excel files (.xlsx, .xls)</span>
                    <span>✓ Up to 10MB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Status */}
        {processingStatus.isProcessing && (
          <Card>
            <CardContent className="p-8 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing Your Leads
              </h3>
              <p className="text-gray-600 mb-4">{processingStatus.message}</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Brain className="h-4 w-4" />
                <span>AI is analyzing your data...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Status */}
        {processingStatus.step === 'complete' && !processingStatus.isProcessing && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Processing Complete!
              </h3>
              <p className="text-gray-600 mb-6">{processingStatus.message}</p>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/dashboard')}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Process Another File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};