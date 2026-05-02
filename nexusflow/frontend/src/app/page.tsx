import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-12 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          NexusFlow
        </h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">Focus Mode</button>
          <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-[0_0_15px_rgba(37,99,235,0.5)]">Executive Heatmap</button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition duration-300">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Project Health</h3>
          <div className="text-4xl font-bold text-green-400">92%</div>
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 w-[92%] shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-purple-500 transition duration-300">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Bots</h3>
          <div className="text-4xl font-bold text-purple-400">14</div>
          <p className="text-sm text-gray-500 mt-2">Processing 240 messages/hr</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-red-500 transition duration-300">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Blocked Dependencies</h3>
          <div className="text-4xl font-bold text-red-400">3</div>
          <p className="text-sm text-red-500/80 mt-2">Requires immediate attention</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Live Activity Stream
        </h2>
        <div className="space-y-4">
          {[
            { time: "2 mins ago", msg: "Slack intent parsed: Task 'Update Q3 Goals' assigned to Sarah.", color: "border-blue-500/30" },
            { time: "15 mins ago", msg: "Dependency Warning: Design delivery delayed, affecting Engineering sprint.", color: "border-red-500/30" },
            { time: "1 hour ago", msg: "Email ingested: New client requirement added to Project Alpha.", color: "border-purple-500/30" }
          ].map((item, i) => (
            <div key={i} className={`p-4 bg-gray-900/50 border-l-4 ${item.color} rounded-r-lg flex justify-between items-center hover:bg-gray-800/80 transition cursor-pointer`}>
              <p className="text-gray-300">{item.msg}</p>
              <span className="text-xs text-gray-500">{item.time}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
