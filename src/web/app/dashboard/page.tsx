"use client";

import React, { useState, useEffect } from "react";
import AgentTopology from "@/components/AgentTopology";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useSWR from "swr";

// Define Agent interface
interface Agent {
  id: string;
  name: string;
  status: "online" | "offline" | "busy";
  lastSeen?: string;
  capabilities?: string[];
  model?: string;
}

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
  // Use SWR to fetch agent data from the backend API
  const { data: agents = [], error: agentsError, mutate } = useSWR<Agent[]>('/api/agents', fetcher);

  const [logs, setLogs] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  
  // Connect to the WebSocket for real-time logs
  const WS_URL = "ws://localhost:3000/ws";

  const { lastMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    // Update connection status
    const statusMap = {
      [ReadyState.CONNECTING]: "Connecting",
      [ReadyState.OPEN]: "Connected",
      [ReadyState.CLOSING]: "Closing",
      [ReadyState.CLOSED]: "Disconnected",
      [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    };
    setConnectionStatus(statusMap[readyState]);
    
    // Handle incoming messages
    if (lastMessage !== null) {
      setLogs(prev => [...prev.slice(-49), `${new Date().toLocaleTimeString()} - ${lastMessage.data}`]); // Keep only last 50 logs
    }
  }, [lastMessage, readyState]);

  // Refresh agents data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      mutate(); // Refresh agent data
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [mutate]);

  if (agentsError) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-100">Control Dashboard</h2>
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-200">
          Error loading agent data: {agentsError.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Control Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              connectionStatus === "Connected" ? "bg-green-500" : 
              connectionStatus === "Connecting" ? "bg-yellow-500 animate-pulse" : 
              "bg-red-500"
            }`} />
            <span className="text-sm text-gray-400">Status: {connectionStatus}</span>
          </div>
          <button 
            onClick={() => mutate()}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{agents.length}</div>
          <div className="text-sm text-gray-400">Total Agents</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {agents.filter(a => a.status === 'online').length}
          </div>
          <div className="text-sm text-gray-400">Online</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {agents.filter(a => a.status === 'busy').length}
          </div>
          <div className="text-sm text-gray-400">Busy</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">
            {agents.filter(a => a.status === 'offline').length}
          </div>
          <div className="text-sm text-gray-400">Offline</div>
        </div>
      </div>

      {/* Topology Visualization */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Agent Topology</h3>
        <AgentTopology agents={agents} />
      </div>

      {/* Live Logs Panel */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Live Log Stream</h3>
          <span className="text-xs text-gray-500">Real-time updates</span>
        </div>
        <div className="bg-black rounded p-4 h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-600 h-full flex items-center justify-center">
              Waiting for log messages...
            </div>
          ) : (
            logs.map((log, i) => (
              <div 
                key={i} 
                className="py-1 border-b border-gray-800 last:border-0 text-gray-300 hover:bg-gray-800/30 px-1 rounded"
              >
                <span className="text-gray-500 mr-3">{log.split(' - ')[0]}</span>
                <span className="text-cyan-400">{log.split(' - ').slice(1).join(' - ')}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}