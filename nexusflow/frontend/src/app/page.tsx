"use client";

import React, { useState, useEffect } from 'react';

// Use Cloud Run backend URL
const API_BASE_URL = "https://nexusflow-backend-687579320432.us-central1.run.app/api";

export default function Home() {
  const [view, setView] = useState<'heatmap' | 'focus'>('heatmap');
  const [dashboardData, setDashboardData] = useState({
    health: 92,
    active_bots: 14,
    blocked_dependencies: 3,
    activity_stream: [
      { time: "2 mins ago", msg: "Slack intent parsed: Task 'Update Q3 Goals' assigned to Sarah.", color: "border-blue-500/30" },
      { time: "15 mins ago", msg: "Dependency Warning: Design delivery delayed, affecting Engineering sprint.", color: "border-red-500/30" },
      { time: "1 hour ago", msg: "Email ingested: New client requirement added to Project Alpha.", color: "border-purple-500/30" }
    ]
  });
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard`);
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data. Make sure backend is running.");
      }
    };

    const fetchTasks = async () => {
      if (view === 'focus') {
        try {
          const res = await fetch(`${API_BASE_URL}/tasks`);
          if (res.ok) {
            const data = await res.json();
            setTasks(data);
          }
        } catch (err) {
          console.error("Failed to fetch tasks.");
        }
      }
    };

    fetchDashboard();
    fetchTasks();
    const interval = setInterval(() => {
      fetchDashboard();
      if (view === 'focus') fetchTasks();
    }, 3000); // Poll every 3 seconds for live updates

    return () => clearInterval(interval);
  }, [view]);

  const handleSimulateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/webhook/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "ui_simulator",
          content: inputText,
          user_id: "user_1"
        })
      });
      setInputText("");
    } catch (err) {
      alert("Failed to send webhook. Is the backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 font-sans pb-24">
      <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          NexusFlow
        </h1>
        <div className="flex gap-4 bg-gray-900 p-1 rounded-lg border border-gray-800">
          <button 
            onClick={() => setView('focus')}
            className={`px-4 py-2 rounded-md transition ${view === 'focus' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Focus Mode
          </button>
          <button 
            onClick={() => setView('heatmap')}
            className={`px-4 py-2 rounded-md transition ${view === 'heatmap' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'text-gray-400 hover:text-white'}`}
          >
            Executive Heatmap
          </button>
        </div>
      </header>

      {view === 'heatmap' ? (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition duration-300">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Project Health</h3>
              <div className={`text-4xl font-bold ${dashboardData.health < 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                {dashboardData.health}%
              </div>
              <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${dashboardData.health < 80 ? 'bg-yellow-400' : 'bg-green-400'}`} 
                  style={{ width: `${dashboardData.health}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-purple-500 transition duration-300">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Bots</h3>
              <div className="text-4xl font-bold text-purple-400">{dashboardData.active_bots}</div>
              <p className="text-sm text-gray-500 mt-2">Processing 240 messages/hr</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-red-500 transition duration-300">
              <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Blocked Dependencies</h3>
              <div className={`text-4xl font-bold ${dashboardData.blocked_dependencies > 3 ? 'text-red-500' : 'text-red-400'}`}>
                {dashboardData.blocked_dependencies}
              </div>
              <p className="text-sm text-red-500/80 mt-2">Requires immediate attention</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Live Activity Stream
            </h2>
            <div className="space-y-4">
              {dashboardData.activity_stream.map((item, i) => (
                <div key={i} className={`p-4 bg-gray-900/50 border-l-4 ${item.color || 'border-blue-500'} rounded-r-lg flex justify-between items-center hover:bg-gray-800/80 transition cursor-pointer`}>
                  <p className="text-gray-300">{item.msg}</p>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Your Action Items</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">
              <p>You have no pending tasks. Check the webhook simulator below to create one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex justify-between items-center hover:border-gray-600 transition">
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                    <span className={`inline-block mt-3 px-2 py-1 text-xs rounded ${task.status === 'blocked' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <button className="px-4 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg text-sm text-gray-300 transition">
                    Mark Complete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Webhook Simulator Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="text-sm text-gray-400 whitespace-nowrap hidden sm:block">
            <strong>Webhook Simulator:</strong> Type a message to simulate parsing.
          </div>
          <form onSubmit={handleSimulateWebhook} className="flex-1 flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'Delay the design delivery by 2 days' or 'Create a new presentation'" 
              className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
