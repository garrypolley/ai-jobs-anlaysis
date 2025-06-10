import Papa from 'papaparse';
import {
  TaskAutomationData,
  ONetTaskData,
  SOCStructureData,
  TaskThinkingData,
  ProcessedTaskData,
  OccupationSummary,
  DataSummary
} from '@/types/data';

const HUGGINGFACE_BASE_URL = 'https://huggingface.co/datasets/Anthropic/EconomicIndex/resolve/main/release_2025_03_27';

export class DataLoader {
  private cache: Map<string, any> = new Map();

  async loadCSV<T>(filename: string): Promise<T[]> {
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }

    try {
      const response = await fetch(`${HUGGINGFACE_BASE_URL}/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
      }

      const csvText = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            if (results.errors.length > 0) {
              console.warn(`Parsing warnings for ${filename}:`, results.errors);
            }
            this.cache.set(filename, results.data);
            resolve(results.data as T[]);
          },
          error: (error: any) => {
            reject(new Error(`Failed to parse CSV ${filename}: ${error.message}`));
          }
        });
      });
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      throw error;
    }
  }

  async loadTaskAutomationData(): Promise<TaskAutomationData[]> {
    return await this.loadCSV<TaskAutomationData>('automation_vs_augmentation_by_task.csv');
  }

  async loadONetTaskData(): Promise<ONetTaskData[]> {
    return await this.loadCSV<ONetTaskData>('onet_task_statements.csv');
  }

  async loadSOCStructureData(): Promise<SOCStructureData[]> {
    return await this.loadCSV<SOCStructureData>('SOC_Structure.csv');
  }

  async loadTaskThinkingData(): Promise<TaskThinkingData[]> {
    return await this.loadCSV<TaskThinkingData>('task_thinking_fractions.csv');
  }

  // Process and combine all data sources
  async processAllData(): Promise<ProcessedTaskData[]> {
    try {
      const [automationData, onetData, thinkingData] = await Promise.all([
        this.loadTaskAutomationData(),
        this.loadONetTaskData(),
        this.loadTaskThinkingData()
      ]);

      // Create lookup maps with fuzzy matching
      const onetMap = new Map<string, { occupation_code: string; occupation_title: string }>();
      const occupationsByCode = new Map<string, string>();

      onetData.forEach(task => {
        const taskKey = task.Task.toLowerCase().trim();
        const code = task['O*NET-SOC Code'];
        const title = task.Title;

        onetMap.set(taskKey, {
          occupation_code: code,
          occupation_title: title
        });

        // Also store occupation by code for fallback
        occupationsByCode.set(code, title);

        // Add fuzzy matching for partial task names
        const words = taskKey.split(' ');
        if (words.length > 3) {
          const shortKey = words.slice(0, 5).join(' ');
          if (!onetMap.has(shortKey)) {
            onetMap.set(shortKey, {
              occupation_code: code,
              occupation_title: title
            });
          }
        }
      });

      const thinkingMap = new Map<string, number>();
      thinkingData.forEach(task => {
        thinkingMap.set(task.task_name.toLowerCase().trim(), task.thinking_fraction);
      });

      // Process automation data
      const processedData: ProcessedTaskData[] = automationData
        .filter(task => task.filtered < 0.8) // Only include tasks that aren't mostly filtered
        .map(task => {
          const taskNameLower = task.task_name.toLowerCase().trim();
          let onetInfo = onetMap.get(taskNameLower);

                    // Try fuzzy matching if exact match not found
          if (!onetInfo) {
            const words = taskNameLower.split(' ');
            for (let i = Math.min(words.length, 6); i >= 3; i--) {
              const partialKey = words.slice(0, i).join(' ');
              onetInfo = onetMap.get(partialKey);
              if (onetInfo) break;
            }

            // If still no match, try searching for similar tasks
            if (!onetInfo && words.length > 0 && words[0].length > 4) {
              for (const [key, value] of Array.from(onetMap.entries())) {
                if (key.includes(words[0])) {
                  onetInfo = value;
                  break;
                }
              }
            }
          }

          const thinkingFraction = thinkingMap.get(taskNameLower) || 0;

          // Calculate automation and augmentation scores
          const automationScore = Math.max(task.directive, task.feedback_loop);
          const augmentationScore = Math.max(task.validation, task.task_iteration, task.learning);

          // Determine category
          let category: 'high_automation' | 'high_augmentation' | 'balanced' | 'filtered';
          if (automationScore > 0.6 && automationScore > augmentationScore + 0.2) {
            category = 'high_automation';
          } else if (augmentationScore > 0.6 && augmentationScore > automationScore + 0.2) {
            category = 'high_augmentation';
          } else if (automationScore > 0.3 || augmentationScore > 0.3) {
            category = 'balanced';
          } else {
            category = 'filtered';
          }

          // Determine risk level
          let risk_level: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';
          if (automationScore > 0.8) risk_level = 'Very High';
          else if (automationScore > 0.6) risk_level = 'High';
          else if (automationScore > 0.4) risk_level = 'Medium';
          else if (automationScore > 0.2) risk_level = 'Low';
          else risk_level = 'Very Low';

          return {
            task_name: task.task_name,
            occupation_code: onetInfo?.occupation_code || 'Unknown',
            occupation_title: onetInfo?.occupation_title || 'Unknown Occupation',
            automation_score: automationScore,
            augmentation_score: augmentationScore,
            thinking_fraction: thinkingFraction,
            category,
            risk_level
          };
        });

      return processedData;
    } catch (error) {
      console.error('Error processing data:', error);
      throw error;
    }
  }

  async generateDataSummary(): Promise<DataSummary> {
    try {
      const processedData = await this.processAllData();

      // Filter out tasks with unknown occupations to get more accurate counts
      const validTasks = processedData.filter(t => t.occupation_code !== 'Unknown');
      const occupations = new Set(validTasks.map(t => t.occupation_code));
      const totalTasks = validTasks.length;

      const avgAutomationScore = validTasks.reduce((sum, t) => sum + t.automation_score, 0) / totalTasks;
      const avgAugmentationScore = validTasks.reduce((sum, t) => sum + t.augmentation_score, 0) / totalTasks;

      // Define high risk as automation score > 0.7
      const highRiskJobs = validTasks.filter(t => t.automation_score > 0.7).length;
      const lowRiskJobs = validTasks.filter(t => t.automation_score < 0.3).length;

      console.log(`Data Summary: ${occupations.size} occupations, ${totalTasks} tasks, ${highRiskJobs} high-risk tasks`);

      return {
        totalOccupations: occupations.size,
        totalTasks,
        avgAutomationScore: Math.round(avgAutomationScore * 100) / 100,
        avgAugmentationScore: Math.round(avgAugmentationScore * 100) / 100,
        highRiskJobs,
        lowRiskJobs
      };
    } catch (error) {
      console.error('Error generating data summary:', error);
      throw error;
    }
  }

  async getOccupationSummaries(): Promise<OccupationSummary[]> {
    const processedData = await this.processAllData();

    // Group by occupation
    const occupationMap = new Map<string, {
      title: string;
      tasks: ProcessedTaskData[];
    }>();

    processedData.forEach(task => {
      if (!occupationMap.has(task.occupation_code)) {
        occupationMap.set(task.occupation_code, {
          title: task.occupation_title,
          tasks: []
        });
      }
      occupationMap.get(task.occupation_code)!.tasks.push(task);
    });

    // Calculate summaries
    const summaries: OccupationSummary[] = Array.from(occupationMap.entries())
      .map(([code, data]) => {
        const tasks = data.tasks;
        const totalTasks = tasks.length;

        if (totalTasks === 0) return null;

        const avgAutomationScore = tasks.reduce((sum, t) => sum + t.automation_score, 0) / totalTasks;
        const avgAugmentationScore = tasks.reduce((sum, t) => sum + t.augmentation_score, 0) / totalTasks;
        const avgThinkingFraction = tasks.reduce((sum, t) => sum + t.thinking_fraction, 0) / totalTasks;
        const highRiskTasks = tasks.filter(t => t.automation_score > 0.7).length;

        // Determine category based on dominant pattern
        let category: string;
        if (avgAutomationScore > 0.6 && avgAutomationScore > avgAugmentationScore + 0.2) {
          category = 'Automation Dominant';
        } else if (avgAugmentationScore > 0.6 && avgAugmentationScore > avgAutomationScore + 0.2) {
          category = 'Augmentation Dominant';
        } else {
          category = 'Balanced Impact';
        }

        return {
          occupation_code: code,
          occupation_title: data.title,
          total_tasks: totalTasks,
          avg_automation_score: avgAutomationScore,
          avg_augmentation_score: avgAugmentationScore,
          avg_thinking_fraction: avgThinkingFraction,
          high_risk_tasks: highRiskTasks,
          category
        };
      })
      .filter(summary => summary !== null) as OccupationSummary[];

    return summaries.sort((a, b) => b.avg_automation_score - a.avg_automation_score);
  }

  async getTopAutomationRiskOccupations(limit: number = 20): Promise<any[]> {
    const summaries = await this.getOccupationSummaries();
    return summaries
      .slice(0, limit)
      .map(summary => ({
        title: summary.occupation_title,
        avgAutomationScore: summary.avg_automation_score,
        taskCount: summary.total_tasks,
        code: summary.occupation_code
      }));
  }

  async getAutomationVsAugmentationAnalysis(): Promise<{
    automationDominant: any[],
    augmentationDominant: any[],
    balanced: any[]
  }> {
    const processedData = await this.processAllData();

    const automationDominant = processedData.filter(t => t.category === 'high_automation');
    const augmentationDominant = processedData.filter(t => t.category === 'high_augmentation');
    const balanced = processedData.filter(t => t.category === 'balanced');

    return {
      automationDominant: automationDominant.slice(0, 100),
      augmentationDominant: augmentationDominant.slice(0, 100),
      balanced: balanced.slice(0, 100)
    };
  }
}