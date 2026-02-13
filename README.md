# OpenClaw Control Center (OCC) - Phase 3

## Overview
OpenClaw Control Center Phase 3 implements a comprehensive web-based dashboard for monitoring and managing OpenClaw agent networks with:

- Interactive agent topology visualization using LeaferJS
- Real-time log streaming via WebSocket connections
- Dynamic configuration management
- Comprehensive monitoring dashboard

## Prerequisites
- Node.js 18+
- npm or yarn

## Getting Started

### 1. Install Dependencies
```bash
cd openclaw-control/src/web
npm install
```

### 2. Start the Backend Server
```bash
cd openclaw-control/src/server
node index.js
```
The server will start on `http://localhost:3000` and expose:
- REST APIs at `/api/*`
- WebSocket endpoint at `/ws`

### 3. Start the Frontend Development Server
```bash
cd openclaw-control/src/web
npm run dev
```
The frontend will start on `http://localhost:3000` (same port as backend due to proxy configuration)

## Features

### Dashboard
- Real-time agent statistics
- Interactive topology visualization
- Live log stream
- Connection status monitoring

### Topology Visualization
- Interactive agent network map
- Color-coded status indicators
- Responsive design

### Configuration Management
- JSON-based configuration editor
- Validation and error handling
- Save/load functionality

### Real-time Monitoring
- WebSocket-based log streaming
- Auto-refreshing agent status
- Connection health monitoring

## Project Structure
```
openclaw-control/
├── src/
│   ├── server/           # Backend server with WebSocket support
│   └── web/              # Next.js frontend application
│       ├── app/          # Pages and routing
│       │   ├── api/      # API routes
│       │   ├── dashboard/ # Main dashboard
│       │   ├── matrix/   # Log stream
│       │   └── config/   # Configuration
│       ├── components/   # Reusable UI components
│       └── public/       # Static assets
```

## Technologies Used
- **Frontend**: Next.js 16.1.6, React 19.2.3, TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: LeaferJS
- **WebSocket**: react-use-websocket
- **Data Fetching**: SWR
- **Icons**: Lucide React
- **Backend**: Fastify.js, ws, chokidar

## API Endpoints
- `GET /api/agents` - Retrieve agent list
- `GET /api/config` - Retrieve configuration
- `POST /api/config` - Update configuration
- `WebSocket /ws` - Real-time log stream

## Development
For development, both servers need to run simultaneously. The backend provides the API and WebSocket services while the frontend provides the user interface.

## Architecture Details
See `OCC_PHASE3_ARCHITECTURE.md` for detailed architectural information.