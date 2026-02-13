// mock-api/route.ts
import { NextResponse } from 'next/server';

// Define Agent interface
interface Agent {
  id: string;
  name: string;
  status: "online" | "offline" | "busy";
  lastSeen?: string;
  capabilities?: string[];
  model?: string;
}

// Mock data generator
function generateMockAgents(): Agent[] {
  const statuses: ("online" | "offline" | "busy")[] = ["online", "offline", "busy"];
  const models = ["GPT-4", "Claude-3", "Gemini-Pro", "Local LLM", "Specialized Agent"];
  const capabilitiesList = [
    ["reasoning", "planning", "learning"],
    ["data processing", "analytics", "reporting"],
    ["task execution", "workflow", "automation"],
    ["communication", "collaboration", "coordination"],
    ["monitoring", "logging", "alerting"]
  ];

  const agents: Agent[] = [];
  const agentCount = 8; // Generate 8 mock agents

  for (let i = 0; i < agentCount; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    const randomCapabilities = capabilitiesList[Math.floor(Math.random() * capabilitiesList.length)];

    agents.push({
      id: `agent-${Math.random().toString(36).substring(2, 10)}-${i}`,
      name: `Agent-${i + 1}`,
      status: randomStatus,
      lastSeen: new Date(Date.now() - Math.floor(Math.random() * 1000000)).toISOString(),
      capabilities: randomCapabilities,
      model: randomModel
    });
  }

  return agents;
}

// GET handler for fetching mock agents
export async function GET(request: Request) {
  const agents = generateMockAgents();
  return NextResponse.json(agents);
}

// POST handler for updating agent status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real implementation, this would update the agent status
    // For now, we'll just return success
    return NextResponse.json({ success: true, updatedAgent: body });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}