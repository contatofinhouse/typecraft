export enum FontStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed'
}

export interface User {
  id: string;
  email: string;
  credits: number;
}

export interface Font {
  id: string;
  user_id: string;
  style_name: string;
  prompt: string;
  status: FontStatus;
  preview_url: string | null;
  download_ttf_url: string | null;
  download_otf_url: string | null;
  download_woff2_url: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  credits: number;
  type: 'purchase' | 'export';
  created_at: string;
}

export interface GeneratePreviewResponse {
  imageUrl: string;
}