import React from 'react';
import { DashboardData } from '../types';

interface ExecutiveHeatmapProps {
  data: DashboardData | undefined;
}

const ExecutiveHeatmap: React.FC<ExecutiveHeatmapProps> = ({ data }) => {
  if (!data) return <div role="status" aria-label="Loading Heatmap">Loading...</div>;

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" aria-label="Key Performance Indicators">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition duration-300">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Project Health</h3>
          <div className={`text-4xl font-bold ${data.health < 80 ? 'text-yellow-400' : 'text-green-400'}`} aria-label={`Project Health is ${data.health} percent`}>
            {data.health}%
          </div>
          <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden" aria-hidden="true">
            <div 
              className={`h-full transition-all duration-1000 ${data.health < 80 ? 'bg-yellow-400' : 'bg-green-400'}`} 
              style={{ width: `${data.health}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-purple-500 transition duration-300">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Active Bots</h3>
          <div className="text-4xl font-bold text-purple-400">{data.active_bots}</div>
          <p className="text-sm text-gray-500 mt-2">Processing 240 messages/hr</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-red-500 transition duration-300">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Blocked Dependencies</h3>
          <div className={`text-4xl font-bold ${data.blocked_dependencies > 3 ? 'text-red-500' : 'text-red-400'}`}>
            {data.blocked_dependencies}
          </div>
          <p className="text-sm text-red-500/80 mt-2">Requires immediate attention</p>
        </div>
      </section>

      <section aria-labelledby="activity-stream-heading">
        <h2 id="activity-stream-heading" className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true"></span>
          Live Activity Stream
        </h2>
        <div className="space-y-4" role="feed" aria-live="polite">
          {data.activity_stream.map((item, i) => (
            <article key={i} className={`p-4 bg-gray-900/50 border-l-4 ${item.color || 'border-blue-500'} rounded-r-lg flex justify-between items-center hover:bg-gray-800/80 transition cursor-pointer`}>
              <p className="text-gray-300">{item.msg}</p>
              <span className="text-xs text-gray-500">{item.time}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default React.memo(ExecutiveHeatmap);
