interface ProviderCardProps {
  question?: string;
  status: "executing" | "inProgress" | "complete";
  result?: string;
}

export function ProviderCard({ question, status, result }: ProviderCardProps) {
  const isLoading = status === "executing" || status === "inProgress";

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 my-3 max-w-md w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🏥</span>
        <h3 className="font-semibold text-blue-900 text-sm">Provider Search</h3>
        {isLoading && (
          <span className="ml-auto flex items-center gap-1 text-xs text-blue-600">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Finding providers...
          </span>
        )}
        {status === "complete" && (
          <span className="ml-auto text-xs text-green-600 font-medium">Found</span>
        )}
      </div>

      {question && (
        <p className="text-xs text-blue-700 mb-2 italic">&quot;{question}&quot;</p>
      )}

      {result && status === "complete" && (
        <div className="bg-white rounded-lg p-3 text-sm text-gray-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
          {result}
        </div>
      )}
    </div>
  );
}
