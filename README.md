# Healthcare Agent UI — CopilotKit + AG-UI

Frontend for the Healthcare Agent system, built with [CopilotKit](https://copilotkit.ai) and the [AG-UI protocol](https://ag-ui.com). Provides a chat interface with generative UI components that visualize tool calls to specialist agents (policy, provider, research).

## Architecture

```
Browser (localhost:3000)
  └── Next.js + CopilotKit (CopilotSidebar, generative UI components)
        └── /api/copilotkit (CopilotRuntime + HttpAgent)
              └── AG-UI Adapter (localhost:8000, FastAPI + ag_ui_strands)
                    ├── PolicyAgent   (HTTP POST /invocations)
                    ├── ProviderAgent (HTTP POST /invocations)
                    └── ResearchAgent (HTTP POST /invocations)
```

**How it works:**
1. User types in CopilotSidebar chat
2. CopilotRuntime forwards to AG-UI adapter via `HttpAgent`
3. Adapter's Strands Agent decides which `@tool` to call
4. `@tool` functions HTTP POST to backend sub-agents
5. AG-UI SSE events stream back: `TOOL_CALL_START`, `TEXT_MESSAGE_CONTENT`, etc.
6. CopilotKit renders generative UI (ProviderCard, PolicySummary, CitationList)

## Prerequisites

- **Node.js 20+** and **npm**
- **Python 3.12+** and **uv** (or pip)
- **Backend agents running** (from `healthcare-agent-agentcore/`)
- **AWS credentials** configured for Bedrock

## Quick Start

### Option A: Full stack with Docker

```bash
cp .env.example .env
# Edit .env with AWS credentials and SERPER_API_KEY

docker compose up --build
# Open http://localhost:3000
```

### Option B: Local development

```bash
# Terminal 1: Start backend agents
cd ../healthcare-agent-agentcore
docker compose up --build

# Terminal 2: Start UI (agent + frontend)
cd ../healthcare-agent-ui
cp .env.example .env
# Edit .env — set agent URLs to localhost ports:
#   POLICY_AGENT_URL=http://localhost:8081/invocations
#   PROVIDER_AGENT_URL=http://localhost:8082/invocations
#   RESEARCH_AGENT_URL=http://localhost:8083/invocations

npm install
cd agent && uv sync && cd ..
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
healthcare-agent-ui/
├── agent/                          # AG-UI adapter (Python)
│   ├── main.py                     # StrandsAgent + @tool HTTP calls
│   └── pyproject.toml
├── src/
│   ├── app/
│   │   ├── layout.tsx              # CopilotKit provider
│   │   ├── page.tsx                # Chat UI + dashboard
│   │   └── api/copilotkit/
│   │       └── route.ts            # CopilotRuntime → HttpAgent
│   └── components/
│       ├── provider-card.tsx       # Generative UI: doctor results
│       ├── policy-summary.tsx      # Generative UI: policy answers
│       ├── research-citations.tsx  # Generative UI: research with sources
│       └── default-tool-ui.tsx     # Fallback tool rendering
├── docker/
│   ├── Dockerfile.agent            # Python AG-UI adapter
│   └── Dockerfile.app              # Next.js frontend
├── docker-compose.yml              # Full stack (5 services + UI)
├── package.json
└── .env.example
```

## Generative UI Components

| Tool Call | Component | Visual |
|---|---|---|
| `query_policy` | PolicySummary | Green card with policy answer, source citation |
| `find_providers` | ProviderCard | Blue card with doctor details, spinner while searching |
| `research_health` | ResearchCitations | Purple card with web sources and links |
| (any other) | DefaultToolComponent | Gray card with expandable args/result |

## Environment Variables

| Variable | Description |
|---|---|
| `AWS_REGION` | AWS region for Bedrock (default: us-east-1) |
| `BEDROCK_MODEL_ID` | Model ID (default: us.anthropic.claude-sonnet-4-20250514-v1:0) |
| `SERPER_API_KEY` | Serper API key for research agent |
| `POLICY_AGENT_URL` | Policy agent endpoint |
| `PROVIDER_AGENT_URL` | Provider agent endpoint |
| `RESEARCH_AGENT_URL` | Research agent endpoint |
| `AGENT_URL` | AG-UI adapter URL (for CopilotRuntime) |

## License

Apache 2.0
