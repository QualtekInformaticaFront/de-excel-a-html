import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingIndicatorProps {
  currentFile: string;
  progress: number;
}

export function ProcessingIndicator({ currentFile, progress }: ProcessingIndicatorProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <div className="flex-1">
          <p className="text-sm text-gray-600">Processing: {currentFile}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}