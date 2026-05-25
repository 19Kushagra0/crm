"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function CRMLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>DineFlow Dashboard</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet" />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Sidebar overlay backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 45,
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      <div className="main-content-layout">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        {children}
      </div>

      <style jsx global>{`
        .main-content-layout {
          margin-left: 220px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        @media (max-width: 767px) {
          .main-content-layout {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
