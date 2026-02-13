"use client";

import React, { useEffect, useRef } from "react";
import { Leafer, App, Box, Text, Line, Ellipse } from "leafer-ui";

interface Agent {
  id: string;
  name: string;
  status: "online" | "offline" | "busy";
  lastSeen?: string;
  capabilities?: string[];
}

interface AgentTopologyProps {
  agents: Agent[];
}

export default function AgentTopology({ agents }: AgentTopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Leafer App
    const app = new App({
      view: containerRef.current,
      tree: {}, // Start empty
      fill: "#0f172a", // Match bg-gray-900 (roughly)
    });
    appRef.current = app;

    const centerX = containerRef.current.clientWidth / 2;
    const centerY = containerRef.current.clientHeight / 2;

    // Draw Gateway (Center)
    const gateway = new Ellipse({
      x: centerX - 30,
      y: centerY - 30,
      width: 60,
      height: 60,
      fill: "#3b82f6", // Blue-500
      stroke: "#60a5fa",
      strokeWidth: 2,
      shadow: { x: 0, y: 0, blur: 20, color: "#3b82f6" }
    });
    
    const gatewayLabel = new Text({
        x: centerX - 30,
        y: centerY + 40,
        text: "GATEWAY",
        fill: "#94a3b8",
        fontSize: 12,
        textAlign: "center",
        width: 60
    });

    app.tree.add(gateway);
    app.tree.add(gatewayLabel);

    // Draw Agents
    const radius = 150;
    const angleStep = (2 * Math.PI) / (agents.length || 1);

    agents.forEach((agent, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Connection Line
      const line = new Line({
        points: [centerX, centerY, x, y],
        stroke: "#1e293b", // Slate-800
        strokeWidth: 2,
        dashPattern: [5, 5]
      });
      app.tree.add(line);
      line.toBottom(); // Send behind nodes

      // Agent Node
      const color = agent.status === "online" ? "#22c55e" : agent.status === "busy" ? "#eab308" : "#ef4444";
      
      const node = new Box({
        x: x - 20,
        y: y - 20,
        width: 40,
        height: 40,
        cornerRadius: 10,
        fill: "#1e293b",
        stroke: color,
        strokeWidth: 2,
        shadow: { x: 0, y: 0, blur: 10, color: color }
      });

      const label = new Text({
        x: x - 40,
        y: y + 25,
        text: agent.name,
        fill: "#e2e8f0",
        fontSize: 12,
        textAlign: "center",
        width: 80
      });

      app.tree.add(node);
      app.tree.add(label);
    });

    return () => {
      app.destroy();
    };
  }, [agents]);

  return <div ref={containerRef} className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-800" />;
}
