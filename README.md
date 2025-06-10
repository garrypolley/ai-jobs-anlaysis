# AI Jobs Impact Analysis Dashboard

A comprehensive NextJS application that analyzes the impact of artificial intelligence on white-collar jobs using data from Anthropic's Economic Index. This tool provides insights into automation risks and augmentation opportunities across various occupations.

## Overview

This dashboard visualizes and analyzes data from the [Anthropic Economic Index](https://www.anthropic.com/economic-index) to help understand how AI might affect different types of work. The data is sourced from their [Hugging Face dataset](https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2025_03_27). The analysis is particularly relevant in light of recent industry discussions about AI's potential to displace entry-level white-collar jobs.

## Features

- **Real-time Data Loading**: Fetches the latest data directly from Hugging Face
- **Interactive Visualizations**: Charts and graphs showing automation vs augmentation trends
- **Occupation Risk Analysis**: Detailed breakdown of automation risk by occupation
- **Executive Summary**: Key insights and metrics at a glance
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Data Sources

This analysis is powered by data from the **Anthropic Economic Index**, which provides insights into AI's effects on the labor market and broader economy over time.

### Primary Data Sources

- **[Anthropic Economic Index](https://www.anthropic.com/economic-index)** - Main research initiative analyzing how Claude is used across the economy
- **[Hugging Face Dataset](https://huggingface.co/datasets/Anthropic/EconomicIndex/tree/main/release_2025_03_27)** - Specific dataset release (2025-03-27) containing the processed data used in this analysis
- **O*NET Database** - Occupational task information
- **Bureau of Labor Statistics** - Standard Occupational Classification (SOC)

### Data Attribution

The core dataset is sourced directly from Anthropic's Economic Index research, which "aims to understand AI's effects on the labor market and broader economy over time" and "provides the clearest picture yet of how AI is being incorporated into real-world tasks across the modern economy."

For the most up-to-date information and research findings, visit: https://www.anthropic.com/economic-index

## Key Metrics Analyzed

1. **Automation Score**: Likelihood that a task will be automated by AI
2. **Augmentation Score**: Potential for AI to enhance human performance
3. **Thinking Fraction**: Proportion of cognitive work in each task
4. **Risk Levels**: Categorization of occupations by automation risk

## Installation & Setup

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd ai-jobs-analysis
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Dashboard Sections

1. **Executive Summary**: Overview of key findings and statistics
2. **Summary Cards**: Quick metrics about the dataset
3. **Key Insights**: Highlighted findings about automation and augmentation risks
4. **Automation vs Augmentation Chart**: Pie chart showing distribution of AI impact types
5. **Highest Risk Occupations**: Bar chart of occupations most at risk of automation
6. **Detailed Analysis**: Sortable table with comprehensive occupation data

### Navigation Tips

- **Interactive Charts**: Hover over chart elements for detailed information
- **Sortable Tables**: Click column headers to sort by different criteria
- **Responsive Layout**: The dashboard adapts to different screen sizes

## Technical Architecture

### Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts library
- **Data Processing**: Papa Parse for CSV handling
- **Language**: TypeScript for type safety

### Key Components

- `Dashboard.tsx` - Main dashboard component
- `DataLoader.ts` - Handles data fetching and processing
- `charts/` - Visualization components
- `types/data.ts` - TypeScript type definitions

### Data Flow

1. Application loads and initializes DataLoader
2. DataLoader fetches CSV files from Hugging Face
3. Data is processed and analyzed
4. Results are displayed in interactive components

## Data Analysis Methodology

### Risk Classification

- **Very High Risk**: >80% automation score
- **High Risk**: 60-80% automation score
- **Medium Risk**: 40-60% automation score
- **Low Risk**: 20-40% automation score
- **Very Low Risk**: <20% automation score

### Categorization

- **Automation Dominant**: Tasks where automation score > augmentation score and automation > 60%
- **Augmentation Dominant**: Tasks where augmentation score > automation score and augmentation > 60%
- **Balanced Impact**: Tasks where automation and augmentation scores are within 20% of each other

## Important Disclaimers

⚠️ **These projections are based on current AI capabilities and should be interpreted as indicators of potential impact rather than definitive predictions.**

- Actual timeline and extent of job displacement may vary significantly
- Adoption rates, regulatory factors, and economic conditions will influence outcomes
- The analysis reflects technological capability, not necessarily economic feasibility
- Entry-level positions may be disproportionately affected as noted in recent industry reports

## Related Articles & Context

This analysis supports discussions around:
- Dario Amodei's warnings about white-collar job displacement
- The "AI Apocalypse" and potential unemployment impacts
- Entry-level career ladder disruption
- Policy implications for workforce development

## Development & Customization

### Adding New Visualizations

1. Create new chart component in `components/charts/`
2. Add data processing logic in `utils/dataLoader.ts`
3. Import and use in `Dashboard.tsx`

### Extending Data Analysis

The `DataLoader` class can be extended with additional methods for:
- Industry-specific analysis
- Geographic breakdowns
- Temporal trend analysis
- Salary impact projections

### Styling Customization

Modify `tailwind.config.js` to adjust:
- Color schemes
- Component spacing
- Responsive breakpoints
- Typography

## Performance Considerations

- Data is cached after first load
- Large CSV files are processed incrementally
- Charts are optimized for performance with data sampling
- Responsive design minimizes mobile data usage

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support & Issues

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Verify internet connection (required for data loading)
3. Ensure you're using a supported browser version
4. Try refreshing the page if data loading fails

---

**Built with ❤️ to help understand AI's impact on the future of work**