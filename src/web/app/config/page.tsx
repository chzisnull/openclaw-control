"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ConfigPage() {
  const { data: config, error, mutate } = useSWR("/api/config", fetcher);
  const [configText, setConfigText] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (config) {
      setConfigText(JSON.stringify(config, null, 2));
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Validate JSON
      const parsed = JSON.parse(configText);
      
      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) throw new Error("Failed to save config");

      setMessage({ type: "success", text: "Configuration saved successfully!" });
      mutate(); // Refresh data
    } catch (e: any) {
      setMessage({ type: "error", text: e.message || "Invalid JSON" });
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div className="text-red-500">Failed to load config</div>;
  if (!config && !error) return <div className="text-gray-400">Loading config...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">System Configuration</h2>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <label className="block mb-2 text-sm font-medium text-gray-300">
          JSON Configuration
        </label>
        <textarea
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          className="w-full h-[60vh] bg-gray-950 text-gray-100 font-mono text-sm p-4 rounded border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          spellCheck={false}
        />
        
        <div className="mt-4 flex items-center justify-between">
            <div>
                {message && (
                    <span className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {message.text}
                    </span>
                )}
            </div>
            <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-2 rounded font-medium transition-colors ${
                saving
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
      </div>
    </div>
  );
}
