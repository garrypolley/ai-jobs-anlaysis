// Raw data types matching the actual Hugging Face dataset structure
export interface TaskAutomationData {
  task_name: string;
  feedback_loop: number;
  directive: number;
  task_iteration: number;
  validation: number;
  learning: number;
  filtered: number;
}

export interface ONetTaskData {
  'O*NET-SOC Code': string;
  'Title': string;
  'Task': string;
}

export interface SOCStructureData {
  'Major Group': string;
  'SOC or O*NET-SOC 2019 Title': string;
}

export interface TaskThinkingData {
  task_name: string;
  thinking_fraction: number;
}

// Processed data types for analysis
export interface ProcessedTaskData {
  task_name: string;
  occupation_code: string;
  occupation_title: string;
  automation_score: number;
  augmentation_score: number;
  thinking_fraction: number;
  category: 'high_automation' | 'high_augmentation' | 'balanced' | 'filtered';
  risk_level: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';
}

export interface OccupationSummary {
  occupation_code: string;
  occupation_title: string;
  total_tasks: number;
  avg_automation_score: number;
  avg_augmentation_score: number;
  avg_thinking_fraction: number;
  high_risk_tasks: number;
  category: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
  color?: string;
}

export interface DataSummary {
  totalOccupations: number;
  totalTasks: number;
  avgAutomationScore: number;
  avgAugmentationScore: number;
  highRiskJobs: number;
  lowRiskJobs: number;
}