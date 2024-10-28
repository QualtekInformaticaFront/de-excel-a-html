export interface WorksheetData {
  name: string;
  html: string;
}

export interface ProcessedFile {
  fileName: string;
  worksheets: WorksheetData[];
}