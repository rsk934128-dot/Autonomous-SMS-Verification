export interface ProgramProject {
  id: string;
  title: string;
  description: string;
  category: 'Utility' | 'Fintech' | 'SaaS' | 'E-commerce' | 'AI Tool' | 'Mobile PWA' | 'SMS & Telecom';
  version: string;
  reactCode: string;
  previewHtml: string;
  features: string[];
  techStack: string[];
  colorTheme: string[];
  createdAt: string;
  updatedAt: string;
  valuationBdt?: number;
  valuationUsd?: number;
  deployedStatus?: 'draft' | 'deploying' | 'live' | 'published';
  deployedUrl?: string;
  shareId?: string;
  authorEmail?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  codeDiffSummary?: string;
  appliedChanges?: string[];
  programSnapshotId?: string;
}

export interface QuickPromptTemplate {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  iconName: string;
  prompt: string;
  description: string;
  descriptionBn: string;
  estimatedLines: number;
}

export interface DeploymentConfig {
  projectName: string;
  targetProvider: 'cloudrun' | 'vercel' | 'netlify' | 'firebase' | 'docker';
  subdomain: string;
  customDomain?: string;
  port: number;
  nodeVersion: string;
  includeDockerfile: boolean;
  includeVercelJson: boolean;
  includeFirebaseJson: boolean;
}
