import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing: boolean;
}

export function FileUploader({ onFilesSelected, isProcessing }: FileUploaderProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files) {
        onFilesSelected(e.dataTransfer.files);
      }
    },
    [onFilesSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onFilesSelected(e.target.files);
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full max-w-2xl p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
    >
      <label className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
        <Upload className="w-12 h-12 text-blue-500" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Drop Excel files here or click to select
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports .xlsx and .xls files
          </p>
        </div>
        <input
          type="file"
          multiple
          accept=".xlsx,.xls"
          onChange={handleChange}
          disabled={isProcessing}
          className="hidden"
        />
      </label>
    </div>
  );
}