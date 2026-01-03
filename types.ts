
export interface PestInfo {
  name: string;
  scientificName: string;
  category: string;
  characteristics: string[];
  anatomy: string;
  habits: string;
  controlMethods: string[];
  healthRisks: string;
  sourceLinks?: { uri: string; title: string }[];
}

export interface RecognitionResult {
  pestFound: boolean;
  pest?: PestInfo;
  confidence: number;
  message?: string;
  sources?: { uri: string; title: string }[];
}
