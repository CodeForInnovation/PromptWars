import React, { useState, useCallback } from 'react';

interface WebhookSimulatorProps {
  apiBaseUrl: string;
}

const WebhookSimulator: React.FC<WebhookSimulatorProps> = ({ apiBaseUrl }) => {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSimulateWebhook = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;
    setIsSubmitting(true);
    try {
      await fetch(`${apiBaseUrl}/webhook/ingest`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer nexusflow-secret-key-123" // API Key auth
        },
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
  }, [inputText, apiBaseUrl]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <div className="text-sm text-gray-400 whitespace-nowrap hidden sm:block">
          <strong>Webhook Simulator:</strong> Type a message to simulate parsing.
        </div>
        <form onSubmit={handleSimulateWebhook} className="flex-1 flex gap-2">
          <label htmlFor="webhook-input" className="sr-only">Simulate Webhook Intent</label>
          <input 
            id="webhook-input"
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. 'Delay the design delivery by 2 days' or 'Create a new presentation'" 
            className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-required="true"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </footer>
  );
};

export default React.memo(WebhookSimulator);
