# Sales Lead Management System

A modern React-based sales lead management application built with TypeScript, Vite, and Tailwind CSS. This application helps sales teams efficiently manage, analyze, and process leads with an intuitive dashboard interface.

## Features

- **Lead Management**: Comprehensive lead tracking with scoring and status management
- **Dashboard Analytics**: Visual insights with charts and statistics
- **Lead Processing**: Automated lead extraction and analysis
- **Authentication**: Secure user authentication and role-based access
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **File Upload**: Lead data import via drag-and-drop interface

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **File Upload**: React Dropzone

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Sales_Lead
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── ui/              # Basic UI components (Button, Card, Input)
├── contexts/            # React contexts (Auth)
├── pages/               # Page components
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── constants/           # Application constants
```

## Key Components

### Pages
- **LandingPage**: Main dashboard overview
- **LoginPage**: User authentication
- **DashboardPage**: Lead analytics and insights
- **ProcessLeadsPage**: Lead processing and file upload

### Core Features
- Lead scoring and qualification
- Status tracking (qualified, unqualified, converted, pending)
- Industry and company size filtering
- Revenue tracking and conversion analytics
- Real-time processing status updates

## Configuration

The application uses several configuration files:
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## License

This project is private and proprietary.