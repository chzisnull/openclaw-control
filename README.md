# OpenClaw Control Center (OCC)

OpenClaw 的全景管理控制台。提供上帝视角，实时监控所有 Agent 的思考过程与交互拓扑。

## 🌟 核心特性

- **上帝视角 (God Mode)**: 基于 **LeaferJS** 的动态拓扑图，直观展示 Agent 网络关系。
- **矩阵监控 (The Matrix)**: 通过 **WebSocket** 实时推送所有 Agent 的本地日志流，感受代码的呼吸。
- **全权掌控**: 可视化编辑 `openclaw.json`，支持模型一键切换与配置校验。
- **双模操作**: 既有炫酷的 Web Dashboard，也有高效的 `occ` 命令行工具。

## 🏗️ 架构说明

本项目采用 **Local First** 设计理念：
- **前端**: Next.js (App Router) + Tailwind CSS + shadcn/ui。
- **可视化**: LeaferJS 高性能 Canvas 引擎。
- **后端**: Fastify + WebSocket + Chokidar (监听 `~/.openclaw` 文件变动)。
- **核心逻辑**: 直接读写本地 `~/.openclaw` 目录，无需额外数据库。

## 🚀 快速开始

### 1. 安装
克隆仓库并安装依赖：
```bash
git clone https://github.com/chzisnull/openclaw-control.git
cd openclaw-control
npm install
cd src/web && npm install
```

### 2. 启动服务
在根目录下运行：
```bash
node bin/occ.js serve
```
或者直接使用 `npm start`:
```bash
npm start
```
服务启动后，访问 `http://localhost:3000` 即可进入控制台。

## 🔌 OpenClaw 接入指南

本项目无需对现有的 OpenClaw 进行任何侵入性修改。它通过以下方式自动接入：
1. **自动定位**: 默认读取环境变量或 `~/.openclaw/openclaw.json`。
2. **实时同步**: 使用 `chokidar` 监听 `~/.openclaw/agents/*/sessions/*.jsonl` 文件。
3. **指令下发**: 通过 OpenClaw 内部 API 实现 UI 端的指令干预。

## 📂 项目结构
- `bin/`: CLI 入口 (`occ`)。
- `src/lib/`: 核心配置读取与文件处理逻辑。
- `src/server/`: Fastify 服务端与 WebSocket 广播中心。
- `src/web/`: Next.js 前端项目（包含 LeaferJS 可视化组件）。

---
*Powered by OpenClaw Code Department & Gemini 3 Pro.*
