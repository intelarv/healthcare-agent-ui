import { CatchAllActionRenderProps } from "@copilotkit/react-core";
import { useState } from "react";

export function DefaultToolComponent({
  name,
  args,
  status,
  result,
}: CatchAllActionRenderProps) {
  const [showDetails, setShowDetails] = useState(false);

  const isLoading = status === "executing" || status === "inProgress";

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 my-2 max-w-md w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {isLoading ? "..." : ""} {name}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            isLoading
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status}
        </span>
      </div>

      {(args || result) && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-500 mt-1 hover:text-gray-700"
        >
          {showDetails ? "Hide" : "Show"} details
        </button>
      )}

      {showDetails && args && (
        <pre className="text-xs bg-white rounded p-2 mt-2 overflow-auto max-h-32 text-gray-600">
          {JSON.stringify(args, null, 2)}
        </pre>
      )}

      {showDetails && result && (
        <pre className="text-xs bg-white rounded p-2 mt-1 overflow-auto max-h-32 text-gray-600">
          {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
