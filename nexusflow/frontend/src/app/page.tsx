"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import ExecutiveHeatmap from '../components/ExecutiveHeatmap';
import FocusMode from '../components/FocusMode';
import WebhookSimulator from '../components/WebhookSimulator';
import AIAssistant from '../components/AIAssistant';
import { DashboardData, Task } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://nexusflow-backend-687579320432.us-central1.run.app/api";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  // Global state for toggling between Executive Heatmap and Focus Mode
  const [view, setView] = useState<'heatmap' | 'focus'>('heatmap');
  
  // Use SWR for efficient fetching, caching, and polling.
  // This simulates a real-time WebSocket connection by polling every 3 seconds.
  // It guarantees the Executive Heatmap is always up-to-date with backend state.
  const { data: dashboardData } = useSWR<DashboardData>(`${API_BASE_URL}/dashboard`, fetcher, { 
    refreshInterval: 3000,
    revalidateOnFocus: true
  });
  
  // Conditionally fetch task data only if Focus Mode is active to save bandwidth.
  const { data: tasksData } = useSWR<Task[]>(
    view === 'focus' ? `${API_BASE_URL}/tasks` : null, 
    fetcher, 
    { refreshInterval: 3000 }
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 font-sans pb-24" role="main">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-800 pb-6 gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          NexusFlow
        </h1>
        <nav aria-label="Main Navigation">
          <ul className="flex gap-4 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <li>
              <button 
                onClick={() => setView('focus')}
                className={`px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${view === 'focus' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                aria-current={view === 'focus' ? 'page' : undefined}
              >
                Focus Mode
              </button>
            </li>
            <li>
              <button 
                onClick={() => setView('heatmap')}
                className={`px-4 py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${view === 'heatmap' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'text-gray-400 hover:text-white'}`}
                aria-current={view === 'heatmap' ? 'page' : undefined}
              >
                Executive Heatmap
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {view === 'heatmap' ? (
        <ExecutiveHeatmap data={dashboardData} />
      ) : (
        <FocusMode tasks={tasksData} />
      )}

      <WebhookSimulator apiBaseUrl={API_BASE_URL} />
      <AIAssistant apiBaseUrl={API_BASE_URL} />
    </main>
  );
}
