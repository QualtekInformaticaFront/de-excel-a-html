import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProcessedFile } from '../types';

interface PreviewPanelProps {
  file: ProcessedFile;
}

export function PreviewPanel({ file }: PreviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const downloadFile = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${file.fileName} - Excel to HTML</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; }
            .container { max-width: 1200px; margin: 0 auto; }
            .sheet { margin-bottom: 40px; }
            .sheet-header { background: #f3f4f6; padding: 12px 16px; margin-bottom: 16px; border-radius: 6px; }
            .sheet-title { margin: 0; color: #111827; font-size: 1.25rem; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
            th { background: #f9fafb; font-weight: 600; color: #374151; }
            tr:nth-child(even) { background: #f9fafb; }
            tr:hover { background: #f0f9ff; }
            @media print {
              .sheet { page-break-after: always; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${file.worksheets.map(sheet => `
              <div class="sheet">
                <div class="sheet-header">
                  <h2 class="sheet-title">${sheet.name}</h2>
                </div>
                ${sheet.html}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.fileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-700 hover:text-gray-900"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <h3 className="text-lg font-semibold text-gray-800">{file.fileName}</h3>
          <span className="text-sm text-gray-500">
            ({file.worksheets.length} sheets)
          </span>
        </div>
        <button
          onClick={downloadFile}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
        >
          <Download className="w-4 h-4" />
          <span>Download Combined HTML</span>
        </button>
      </div>
      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {file.worksheets.map((worksheet, index) => (
            <div key={worksheet.name} className="p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Sheet {index + 1}: {worksheet.name}
              </div>
              <div className="bg-gray-50 rounded overflow-auto max-h-96">
                <div
                  dangerouslySetInnerHTML={{ __html: worksheet.html }}
                  className="preview-content"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}