import React from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
 children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
 return (
  <div className="flex h-screen bg-gray-50">
   <Sidebar />
   <div className="flex-1 flex flex-col overflow-hidden">
    <main className="flex-1 overflow-auto">{children}</main>
   </div>
  </div>
 );
};
