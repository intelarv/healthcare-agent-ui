"use client";

import {
  useDefaultTool,
  useRenderToolCall,
  useCoAgent,
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { ProviderCard } from "@/components/provider-card";
import { PolicySummary } from "@/components/policy-summary";
import { ResearchCitations } from "@/components/research-citations";
import { DefaultToolComponent } from "@/components/default-tool-ui";

export default function HealthcarePage() {
  const { state } = useCoAgent({
    name: "healthcare_agent",
    initialState: {
      active_agent: null,
      last_query: null,
    },
  });

  // Generative UI for provider search results
  useRenderToolCall(
    {
      name: "find_providers",
      render: (props) => (
        <ProviderCard
          question={props.args?.question}
          status={props.status}
          result={props.result}
        />
      ),
    },
    [],
  );

  // Generative UI for policy questions
  useRenderToolCall(
    {
      name: "query_policy",
      render: (props) => (
        <PolicySummary
          question={props.args?.question}
          status={props.status}
          result={props.result}
        />
      ),
    },
    [],
  );

  // Generative UI for research results
  useRenderToolCall(
    {
      name: "research_health",
      render: (props) => (
        <ResearchCitations
          question={props.args?.question}
          status={props.status}
          result={props.result}
        />
      ),
    },
    [],
  );

  // Fallback rendering for any other tools
  useDefaultTool(
    {
      render: (props) => <DefaultToolComponent {...props} />,
    },
    [],
  );

  return (
    <main>
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        labels={{
          title: "Healthcare Assistant",
          initial:
            "Hi! I can help you with insurance coverage, finding doctors, and health information. What do you need help with?",
        }}
        suggestions={[
          {
            title: "Insurance Coverage",
            message: "What is my copay for office visits?",
          },
          {
            title: "Find a Doctor",
            message: "Find me a doctor in Austin, Texas",
          },
          {
            title: "Health Research",
            message: "What are the symptoms of diabetes?",
          },
          {
            title: "Multi-Agent",
            message:
              "I need mental health assistance and live in Austin TX. Who can I see and what is covered?",
          },
        ]}
      >
        <HealthcareDashboard activeAgent={state?.active_agent} />
      </CopilotSidebar>
    </main>
  );
}

function HealthcareDashboard({
  activeAgent,
}: {
  activeAgent: string | null;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Healthcare Assistant
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered insurance, provider, and health information
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <AgentCard
            icon="📋"
            title="Policy Agent"
            description="Insurance coverage, copays, deductibles"
            active={activeAgent === "PolicyAgent"}
          />
          <AgentCard
            icon="🏥"
            title="Provider Agent"
            description="Find in-network doctors by location"
            active={activeAgent === "ProviderAgent"}
          />
          <AgentCard
            icon="🔬"
            title="Research Agent"
            description="Health conditions, symptoms, treatments"
            active={activeAgent === "ResearchAgent"}
          />
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Try asking:
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              &bull; &quot;What is my coinsurance for office visits?&quot;
            </li>
            <li>
              &bull; &quot;Find a cardiologist in Houston, Texas&quot;
            </li>
            <li>
              &bull; &quot;What are the treatment options for high cholesterol?&quot;
            </li>
            <li>
              &bull; &quot;I&apos;m pregnant and need care in Miami. What are my options?&quot;
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AgentCard({
  icon,
  title,
  description,
  active,
}: {
  icon: string;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 text-center transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-lg scale-105"
          : "bg-white/80 text-gray-700 shadow-sm"
      }`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className={`text-xs mt-1 ${active ? "text-indigo-100" : "text-gray-500"}`}>
        {description}
      </p>
      {active && (
        <div className="mt-2 text-xs font-medium animate-pulse">
          Processing...
        </div>
      )}
    </div>
  );
}
