import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, BarChart3, Upload } from "lucide-react";
import { Button } from "../components/ui/Button";

export const LandingPage: React.FC = () => {
 const navigate = useNavigate();

 return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
   {/* Hero Section */}
   <div className="relative overflow-hidden p-16">
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
       Welcome to{" "}
       <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        LeadIQ
       </span>
      </h1>

      <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
       Transform your sales process with AI-powered lead scoring. Identify
       high-quality prospects, optimize conversions, and accelerate your revenue
       growth.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
       <Button
        size="lg"
        className="px-8 py-4 text-lg"
        onClick={() => navigate("/process-leads")}
       >
        <Upload className="mr-2 h-5 w-5" />
        Process New Leads
       </Button>

       <Button
        variant="outline"
        size="lg"
        className="px-8 py-4 text-lg"
        onClick={() => navigate("/dashboard")}
       >
        <BarChart3 className="mr-2 h-5 w-5" />
        View Dashboard
       </Button>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};
