import React from 'react';
import { Task } from '../types';

interface FocusModeProps {
  tasks: Task[] | undefined;
}

const FocusMode: React.FC<FocusModeProps> = ({ tasks }) => {
  if (!tasks) return <div role="status" aria-label="Loading Tasks">Loading...</div>;

  return (
    <section className="max-w-4xl mx-auto" aria-labelledby="action-items-heading">
      <h2 id="action-items-heading" className="text-2xl font-bold mb-6">Your Action Items</h2>
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800 text-gray-400">
          <p>You have no pending tasks. Check the webhook simulator below to create one!</p>
        </div>
      ) : (
        <div className="space-y-4" role="list">
          {tasks.map((task) => (
            <article key={task.id} role="listitem" className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex justify-between items-center hover:border-gray-600 transition">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                <span className={`inline-block mt-3 px-2 py-1 text-xs rounded font-medium ${task.status === 'blocked' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {task.status.toUpperCase()}
                </span>
              </div>
              <button 
                className="px-4 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg text-sm text-gray-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Mark task ${task.title} as complete`}
              >
                Mark Complete
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default React.memo(FocusMode);
