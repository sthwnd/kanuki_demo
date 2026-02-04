import { useState, useEffect } from "react";
import { PRODUCT_SCHEMA, TENANTS } from "./data.js";
import { translatePolicy } from "./policyAuthoring.js";

function SystemState({ tenant }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {/* Product side */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#3B82F6" }}></div>
          <div className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            SaaS Product
          </div>
        </div>
        <div className="text-lg text-gray-900 font-semibold mb-4">{PRODUCT_SCHEMA.name}</div>

        <div className="space-y-3">
          {PRODUCT_SCHEMA.resources.map((r) => (
            <div key={r.name}>
              <div className="text-sm font-semibold text-gray-800 mb-1">{r.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {r.actions.map((a) => (
                  <span
                    key={a}
                    className={`text-sm px-2 py-0.5 rounded font-medium ${
                      a === "Delete Invoice" || a === "Bulk Delete"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-blue-50 text-blue-800 border border-blue-100"
                    }`}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-4">Synced 2 min ago</div>
      </div>

      {/* Customer org side */}
      <div
        className="rounded-lg p-5 shadow-sm"
        style={{
          backgroundColor: `${tenant.accent}08`,
          border: `1px solid ${tenant.accent}30`,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: tenant.accent }}
          ></div>
          <div className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Customer Organization
          </div>
        </div>
        <div
          className="text-lg font-semibold mb-4"
          style={{ color: tenant.accentMuted }}
        >
          {tenant.name}
        </div>

        <div className="space-y-3">
          {tenant.attributes.map((a) => (
            <div key={a.name}>
              <div className="text-sm font-semibold text-gray-800 mb-1">{a.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {a.values.map((v) => (
                  <span
                    key={v}
                    className="text-sm px-2 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: `${tenant.accent}12`,
                      color: tenant.accentMuted,
                      border: `1px solid ${tenant.accent}25`,
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-gray-700">Users</span>
          <span className="text-sm font-semibold text-gray-900">{tenant.users.length}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">Synced 2 min ago</div>
      </div>
    </div>
  );
}

function PolicyCard({ policy, onApply, applied }) {
  const [showJson, setShowJson] = useState(false);

  const ruleText = policy.effect === "allow_only"
    ? `${policy.attribute} = ${policy.value} → Allow. All others → Deny.`
    : `${policy.attribute} = ${policy.value} → Deny.`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mt-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="text-base font-semibold text-gray-900">{policy.name}</div>
        <button
          onClick={() => setShowJson(!showJson)}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {showJson ? "View card" : "View as JSON"}
        </button>
      </div>

      {showJson ? (
        <pre className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded p-4 overflow-auto">
          {JSON.stringify(policy, null, 2)}
        </pre>
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Resource</div>
            <div className="text-base text-gray-900">{policy.resource} → {policy.action}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Rule</div>
            <div className="text-base text-gray-900">{ruleText}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Impact</div>
            <div className="text-base text-gray-900">
              <span className="text-green-700 font-medium">Retain access:</span>{" "}
              {policy.impact.retain.length <= 4
                ? policy.impact.retain.join(", ")
                : `${policy.impact.retain.slice(0, 3).join(", ")}, +${policy.impact.retain.length - 3} others`}
            </div>
            <div className="text-base text-gray-900 mt-1">
              <span className="text-red-700 font-medium">Lose access:</span>{" "}
              {policy.impact.lose.length <= 4
                ? policy.impact.lose.join(", ")
                : `${policy.impact.lose.slice(0, 3).join(", ")}, +${policy.impact.lose.length - 3} others`}
            </div>
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <span className="text-sm text-green-700 font-medium">✓ Validated</span>
            <span className="text-sm text-gray-500">No conflicts detected</span>
          </div>
        </div>
      )}

      {!applied ? (
        <button
          onClick={onApply}
          className="mt-5 px-4 py-2.5 text-white text-sm font-medium rounded cursor-pointer w-full"
          style={{ backgroundColor: "#3B82F6" }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#2563EB"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#3B82F6"}
        >
          Apply Policy
        </button>
      ) : (
        <div className="mt-5 px-4 py-2.5 bg-green-50 text-green-700 border border-green-200 text-sm font-medium rounded text-center">
          Policy Active
        </div>
      )}
    </div>
  );
}

export default function KanukiConsole({ tenantId, onTenantChange, onApplyPolicy, onBackToCRM, policies }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proposedPolicy, setProposedPolicy] = useState(null);
  const [applied, setApplied] = useState(false);

  const tenant = TENANTS[tenantId];
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  useEffect(() => {
    setInput("");
    setProposedPolicy(null);
    setApplied(false);
    setError(null);
  }, [tenantId]);

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
    onApplyPolicy({ ...proposedPolicy, tenantId });
    setApplied(true);
  };

  const handleNewPolicy = () => {
    setInput("");
    setProposedPolicy(null);
    setApplied(false);
    setError(null);
  };

  const tenantPolicies = policies.filter((p) => p.tenantId === tenantId);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-200"
        style={{ borderTop: `3px solid ${tenant.accent}` }}
      >
        <div className="flex items-center gap-6">
          <div>
            <div className="text-lg font-bold tracking-tight" style={{ color: "#3B82F6" }}>
              kanuki
            </div>
            <div className="text-xs text-gray-500">Policy Console</div>
          </div>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tenant.accent }}
            ></div>
            <div>
              <div className="text-xs text-gray-500">Customer</div>
              <div className="text-lg font-semibold" style={{ color: tenant.accentMuted }}>
                {tenant.name}
              </div>
            </div>
            <select
              value={tenantId}
              onChange={(e) => onTenantChange(e.target.value)}
              className="ml-2 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs text-gray-600 cursor-pointer focus:outline-none"
            >
              {Object.values(TENANTS).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onBackToCRM}
          className="px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 text-gray-600 rounded hover:bg-gray-100 hover:text-gray-800 cursor-pointer"
        >
          ← Back to AcmeCRM
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <SystemState tenant={tenant} />

        <div className="mt-8">
          <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">
            Describe the access policy you want to define
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 bg-white border border-gray-300 rounded px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 shadow-sm"
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="px-5 py-3 text-white text-sm font-medium rounded disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-sm"
              style={{ backgroundColor: "#3B82F6" }}
            >
              {loading ? "..." : "Submit"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3">
            {error}
          </div>
        )}

        {proposedPolicy && (
          <PolicyCard policy={proposedPolicy} onApply={handleApply} applied={applied} />
        )}

        {applied && (
          <button
            onClick={handleNewPolicy}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            + Define another policy
          </button>
        )}

        {tenantPolicies.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              Active Policies · {tenant.name}
            </div>
            {tenantPolicies.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-700 mb-2">
                <span className="text-green-600 text-xs">●</span>
                <span className="font-medium">{p.name}</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">{p.resource} → {p.action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}