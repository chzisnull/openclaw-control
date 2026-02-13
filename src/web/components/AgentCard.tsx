import React from "react";
import { Activity, Clock, Cpu } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  status: "online" | "offline" | "busy";
  lastSeen?: string;
  capabilities?: string[];
  model?: string;
}

export default function AgentCard({ agent }: { agent: Agent }) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-red-500",
    busy: "bg-yellow-500",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-100">{agent.name}</h3>
          <div className="text-xs text-gray-500 font-mono">{agent.id}</div>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColors[agent.status]} shadow-[0_0_8px_currentColor]`} />
      </div>

      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex items-center gap-2">
            <Activity size={14} />
            <span className="capitalize">{agent.status}</span>
        </div>
        {agent.lastSeen && (
            <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{new Date(agent.lastSeen).toLocaleString()}</span>
            </div>
        )}
        {agent.model && (
             <div className="flex items-center gap-2">
                <Cpu size={14} />
                <span>{agent.model}</span>
            </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="flex flex-wrap gap-2">
            {agent.capabilities?.map((cap) => (
                <span key={cap} className="px-2 py-1 bg-gray-800 text-xs rounded text-gray-300">
                    {cap}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
}
