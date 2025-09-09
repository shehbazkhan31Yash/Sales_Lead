import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, BarChart3, Upload, Zap, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Scoring',
      description: 'Advanced machine learning algorithms analyze and score your leads automatically'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Get instant insights into your lead quality and conversion patterns'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process thousands of leads in seconds with our optimized AI pipeline'
    },
    {
      icon: TrendingUp,
      title: 'Improve Conversions',
      description: 'Focus on high-quality leads and increase your conversion rates by 40%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <Brain className="h-20 w-20 text-indigo-600" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-pink-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LeadIQ
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Transform your sales process with AI-powered lead scoring. 
              Identify high-quality prospects, optimize conversions, and accelerate your revenue growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/process-leads')}
              >
                <Upload className="mr-2 h-5 w-5" />
                Process New Leads
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg"
                onClick={() => navigate('/dashboard')}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powered by Advanced AI Technology
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our intelligent system analyzes multiple data points to provide accurate lead scores and actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">40%+</div>
              <div className="text-indigo-200">Increase in Conversions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10x</div>
              <div className="text-indigo-200">Faster Lead Processing</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-indigo-200">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Transform Your Lead Management?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Start scoring your leads with AI today and see immediate improvements in your sales pipeline.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="px-8 py-4"
            onClick={() => navigate('/process-leads')}
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Your Leads
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4"
            onClick={() => navigate('/dashboard')}
          >
            <Users className="mr-2 h-5 w-5" />
            Explore Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};