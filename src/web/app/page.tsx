import Link from "next/link";
import { Terminal, Network, Settings, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black font-sans">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl px-4 py-16 text-center">
        <div className="mb-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Terminal className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-4">
            OpenClaw Control Center
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Centralized management interface for your OpenClaw agent network. Monitor, configure, and orchestrate your distributed AI agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
          <Link 
            href="/dashboard" 
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/50 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Dashboard</h3>
              <p className="text-gray-400 text-sm">Monitor agent status and topology</p>
            </div>
          </Link>
          
          <Link 
            href="/matrix" 
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-800/50 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                <Network className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Matrix</h3>
              <p className="text-gray-400 text-sm">Real-time log stream</p>
            </div>
          </Link>
          
          <Link 
            href="/config" 
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-yellow-500/50 transition-all duration-300 hover:bg-gray-800/50 group"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                <Settings className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Configuration</h3>
              <p className="text-gray-400 text-sm">System settings and parameters</p>
            </div>
          </Link>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Phase 3 Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300 text-left">
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Real-time Agent Topology</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> WebSocket Log Streaming</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Interactive Dashboard</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Dynamic Configuration</li>
          </ul>
        </div>
      </main>
    </div>
  );
}