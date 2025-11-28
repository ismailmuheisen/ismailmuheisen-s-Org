export enum ContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface AnalysisResult {
  isAiGenerated: boolean;
  confidenceScore: number; // 0 to 100
  verdict: string; // e.g., "Likely AI", "Human Written", "Deepfake"
  reasoning: string[];
  technicalIndicators: string[];
  analyzedAt: string;
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  type: ContentType;
  preview: string; // Snippet of text or thumbnail URL
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}