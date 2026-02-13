"use client";

import React, { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function MatrixPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Connect to the WebSocket on localhost:3000
  // In production/deployment, this URL might need to be dynamic
  const WS_URL = "ws://localhost:3000/ws";

  const { lastMessage, readyState } = useWebSocket(WS_URL, {
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      setLogs((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono text-green-500">
          The Matrix
        </h2>
        <div className="text-xs font-mono">
          Status:{" "}
          <span
            className={
              readyState === ReadyState.OPEN ? "text-green-400" : "text-red-400"
            }
          >
            {connectionStatus}
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 bg-black border border-green-800 rounded p-4 overflow-y-auto font-mono text-xs md:text-sm shadow-[0_0_20px_rgba(0,255,0,0.1)]"
      >
        {logs.length === 0 ? (
          <div className="text-gray-600 italic">Waiting for signal...</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="mb-1 break-all text-green-500 hover:bg-green-900/20 px-1 rounded transition-colors">
              <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
