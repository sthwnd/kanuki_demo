import { useState } from "react";
import { PRODUCT_SCHEMA, TENANTS } from "./data.js";
import { translatePolicy } from "./policyAuthoring.js";

// Displays the known schema for the current tenant
function SystemState({ tenant }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      {/* Product side */}
      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-3">
          Known Product · {PRODUCT_SCHEMA.name}
        </div>
        <div className="space-y-2">
          {PRODUCT_SCHEMA.resources.map((r) => (
            <div key={r.name} className="flex items-start gap-2">
              <span className="text-sm text-zinc-300 font-medium w-24 shrink-0">{r.name}</span>
              <div className="flex flex-wrap gap-1">
                {r.actions.map((a) => (
                  <span key={a} className="text-xs px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Org side */}
      <div className="bg-zinc-800 rounded-lg p-4">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-3">
          Known Org · {tenant.name}
        </div>
        <div className="space-y-2">
          {tenant.attributes.map((a) => (
            <div key={a.name} className="flex items-start gap-2">
              <span className="text-sm text-zinc-300 font-medium w-32 shrink-0">{a.name}</span>
              <div className="flex flex-wrap gap-1">
                {a.values.map((v) => (
                  <span key={v} className="text-xs px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-zinc-300 font-medium w-32 shrink-0">Users</span>
            <span className="text-xs text-zinc-400">{tenant.users.length}</span>
          </div>
        </div>
        <div className="text-[10px] text-zinc-600 mt-3">Last synced: 2 min ago</div>
      </div>
    </div>
  );
}

// Structured policy card with validation indicators
function PolicyCard({ policy, onApply, applied }) {
  const [showJson, setShowJson] = useState(false);

  // Format the rule as readable text
  const ruleText = policy.effect === "allow_only"
    ? `${policy.attribute} = ${policy.value} → Allow. All others → Deny.`
    : `${policy.attribute} = ${policy.value} → Deny.`;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-zinc-200">{policy.name}</div>
        <button
          onClick={() => setShowJson(!showJson)}
          className="text-[11px] text-zinc-500 hover:text-zinc-400 cursor-pointer"
        >
          {showJson ? "View card" : "View as JSON"}
        </button>
      </div>

      {showJson ? (
        <pre className="text-xs text-zinc-400 bg-zinc-900 rounded p-3 overflow-auto">
          {JSON.stringify(policy, null, 2)}
        </pre>
      ) : (
        <div className="space-y-3 text-sm">
          {/* Resource + Action */}
          <div className="flex gap-6">
            <div>
              <div className="text-[11px] text-zinc-500 mb-0.5">Resource</div>
              <div className="text-zinc-300">{policy.resource} → {policy.action}</div>
            </div>
          </div>

          {/* Rule */}
          <div>
            <div className="text-[11px] text-zinc-500 mb-0.5">Rule</div>
            <div className="text-zinc-300">{ruleText}</div>
          </div>

          {/* Impact */}
          <div>
            <div className="text-[11px] text-zinc-500 mb-0.5">Impact</div>
            <div className="text-zinc-300">
              <span className="text-green-400">Retain access:</span>{" "}
              {policy.impact.retain.length <= 4
                ? policy.impact.retain.join(", ")
                : `${policy.impact.retain.slice(0, 3).join(", ")}, +${policy.impact.retain.length - 3} others`}
            </div>
            <div className="text-zinc-300 mt-0.5">
              <span className="text-red-400">Lose access:</span>{" "}
              {policy.impact.lose.length <= 4
                ? policy.impact.lose.join(", ")
                : `${policy.impact.lose.slice(0, 3).join(", ")}, +${policy.impact.lose.length - 3} others`}
            </div>
          </div>

          {/* Validation — boring, deterministic, rule-engine feel */}
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-700">
            <span className="text-xs text-green-500">✓ Validated</span>
            <span className="text-xs text-zinc-500">No conflicts detected</span>
          </div>
        </div>
      )}

      {/* Apply button */}
      {!applied ? (
        <button
          onClick={onApply}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 cursor-pointer w-full"
        >
          Apply Policy
        </button>
      ) : (
        <div className="mt-4 px-4 py-2 bg-zinc-700 text-emerald-400 text-sm rounded text-center">
          Policy Active
        </div>
      )}
    </div>
  );
}

// Main Kanuki console component
export default function KanukiConsole({ tenantId, onApplyPolicy, policies }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proposedPolicy, setProposedPolicy] = useState(null);
  const [applied, setApplied] = useState(false);

  const tenant = TENANTS[tenantId];

  // API key from env — set in .env as VITE_ANTHROPIC_API_KEY
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const handleSubmit = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setError("Missing API key. Add VITE_ANTHROPIC_API_KEY to .env file.");
      return;
    }

    setLoading(true);
    setError(null);
    setProposedPolicy(null);
    setApplied(false);

    try {
      const policy = await translatePolicy(input, tenant, apiKey);
      setProposedPolicy(policy);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!proposedPolicy) return;
    // Add tenant ID and pass to parent
    onApplyPolicy({
      ...proposedPolicy,
      tenantId,
    });
    setApplied(true);
  };

  // Reset state when tenant changes
  const handleNewPolicy = () => {
    setInput("");
    setProposedPolicy(null);
    setApplied(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-base font-semibold tracking-tight">kanuki</div>
          <div className="text-xs text-zinc-500 mt-0.5">{tenant.name}</div>
        </div>
        <div className="text-[11px] text-zinc-600">Policy Console</div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Known system state */}
        <SystemState tenant={tenant} />

        {/* Policy input */}
        <div className="mt-6">
          <label className="text-[11px] uppercase tracking-wider text-zinc-500 block mb-2">
            Describe the access policy you want to define
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder='e.g. "Only the finance department should be able to see the billing page"'
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-zinc-700 text-zinc-200 text-sm rounded hover:bg-zinc-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 text-sm text-red-400 bg-red-950 border border-red-900 rounded px-3 py-2">
            {error}
          </div>
        )}

        {/* Policy card */}
        {proposedPolicy && (
          <PolicyCard policy={proposedPolicy} onApply={handleApply} applied={applied} />
        )}

        {/* New policy button after applying */}
        {applied && (
          <button
            onClick={handleNewPolicy}
            className="mt-3 text-xs text-zinc-500 hover:text-zinc-400 cursor-pointer"
          >
            + Define another policy
          </button>
        )}

        {/* Active policies for this tenant */}
        {policies.filter((p) => p.tenantId === tenantId).length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-3">
              Active Policies · {tenant.name}
            </div>
            {policies
              .filter((p) => p.tenantId === tenantId)
              .map((p, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-400 mb-2">
                  <span className="text-green-500 text-xs">●</span>
                  <span>{p.name}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500">{p.resource} → {p.action}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}