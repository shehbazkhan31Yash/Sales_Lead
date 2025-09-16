import React from "react";
import { NavLink } from "react-router-dom";
import {
 LayoutDashboard,
 Upload,
 Users,
 BarChart3,
 Settings,
 LogOut,
 Brain,
 User,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/cn";

const navigation = [
 { name: "Home", href: "/", icon: LayoutDashboard },
 { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
 { name: "Analyze Leads", href: "/process-leads", icon: Upload },
//  { name: "All Leads", href: "#", icon: Users },
//  { name: "Analytics", href: "#", icon: BarChart3 },
//  { name: "Settings", href: "#", icon: Settings },
];

export const Sidebar: React.FC = () => {
 const { logout, user } = useAuth();

 return (
  <div className="flex h-full w-64 flex-col bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
   <div className="flex items-center justify-center p-6">
    <div className="flex items-center space-x-2">
     <Brain className="h-8 w-8 text-pink-400" />
     <span className="text-2xl font-bold">LeadIQ</span>
    </div>
   </div>

   <nav className="flex-1 space-y-1 px-4">
    {navigation.map((item) => (
     <NavLink
      key={item.name}
      to={item.href}
      className={({ isActive }) =>
       cn(
        "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
        isActive
         ? "bg-white/10 text-white shadow-lg"
         : "text-indigo-200 hover:bg-white/5 hover:text-white"
       )
      }
     >
      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
      {item.name}
     </NavLink>
    ))}
   </nav>
   <div className="px-4">
    <button
     onClick={logout}
     className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-indigo-200 transition-colors hover:bg-white/5 hover:text-white"
    >
     <User className="mr-3 h-5 w-5" />
     {user?.name}
    </button>
   </div>
   <div className="p-4">
    <button
     onClick={logout}
     className="flex w-full items-center rounded-lg px-4 text-sm font-medium text-indigo-200 transition-colors hover:bg-white/5 hover:text-white"
    >
     <LogOut className="mr-3 h-5 w-5" />
     Logout
    </button>
   </div>
  </div>
 );
};
