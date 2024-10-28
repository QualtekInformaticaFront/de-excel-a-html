import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { FileUploader } from './components/FileUploader';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { PreviewPanel } from './components/PreviewPanel';
import type { ProcessedFile } from './types';
import { FileSpreadsheet } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [progress, setProgress] = useState(0);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  const processExcelFile = useCallback(async (file: File): Promise<ProcessedFile> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const worksheets = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const html = XLSX.utils.sheet_to_html(worksheet);
          return { name: sheetName, html };
        });

        resolve({ fileName: file.name, worksheets });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFilesSelected = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    setProcessedFiles([]);
    
    const totalFiles = files.length;
    const processed: ProcessedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFile(file.name);
      setProgress((i / totalFiles) * 100);

      const result = await processExcelFile(file);
      processed.push(result);
    }

    setProcessedFiles(processed);
    setIsProcessing(false);
    setProgress(100);
  }, [processExcelFile]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FileSpreadsheet className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Excel to HTML Converter
          </h1>
          <p className="text-gray-600">
            Convert your Excel files to HTML format with ease
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <FileUploader
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
          />

          {isProcessing && (
            <ProcessingIndicator
              currentFile={currentFile}
              progress={progress}
            />
          )}

          <div className="w-full space-y-6">
            {processedFiles.map((file, index) => (
              <PreviewPanel key={index} file={file} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;