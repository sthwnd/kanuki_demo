import { useState } from "react";
import { TENANTS, DASHBOARD_DATA, BILLING_DATA, CONTACTS_DATA } from "./data.js";
import { checkAccess } from "./policyEngine.js";

function DashboardPage({ canExport }) {
  const cards = [
    { label: "Total Revenue", value: DASHBOARD_DATA.revenue },
    { label: "Active Deals", value: DASHBOARD_DATA.activeDeals },
    { label: "Pipeline", value: DASHBOARD_DATA.pipeline },
    { label: "Closed This Month", value: DASHBOARD_DATA.closedThisMonth },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
        {canExport ? (
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Export CSV
          </button>
        ) : (
          <span
            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-400 rounded cursor-not-allowed"
            title="Restricted by your organization's policy"
          >
            Export CSV
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="text-2xl font-semibold text-gray-800 mt-1">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Billing</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="pb-2 font-medium">Client</th>
            <th className="pb-2 font-medium">Amount</th>
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {BILLING_DATA.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="py-3 text-gray-800">{row.client}</td>
              <td className="py-3 text-gray-800">{row.amount}</td>
              <td className="py-3 text-gray-500">{row.date}</td>
              <td className="py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  row.status === "Paid" ? "bg-green-50 text-green-700"
                    : row.status === "Pending" ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactsPage({ canExport }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
        {canExport ? (
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Export CSV
          </button>
        ) : (
          <span
            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-400 rounded cursor-not-allowed"
            title="Restricted by your organization's policy"
          >
            Export CSV
          </span>
        )}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">Company</th>
            <th className="pb-2 font-medium">Role</th>
          </tr>
        </thead>
        <tbody>
          {CONTACTS_DATA.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="py-3 text-gray-800">{row.name}</td>
              <td className="py-3 text-blue-600">{row.email}</td>
              <td className="py-3 text-gray-500">{row.company}</td>
              <td className="py-3 text-gray-500">{row.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccessRestricted({ policyName }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <div className="text-gray-800 font-medium mb-1">Access restricted by your organization's policy</div>
      <div className="text-sm text-gray-400">{policyName}</div>
    </div>
  );
}

export default function App() {
  const [tenantId, setTenantId] = useState("regal");
  const [userId, setUserId] = useState("sarah");
  const [activePage, setActivePage] = useState("Dashboard");
  const [policies, setPolicies] = useState([]);

  const tenant = TENANTS[tenantId];
  const user = tenant.users.find((u) => u.id === userId);

  const switchTenant = (newTenantId) => {
    setTenantId(newTenantId);
    setUserId(TENANTS[newTenantId].users[0].id);
    setActivePage("Dashboard");
  };

  // Policy engine checks
  const pageAccess = checkAccess(policies, user, tenantId, activePage, "View");
  const exportAccess = checkAccess(policies, user, tenantId, activePage, "Export CSV");

  const pages = ["Dashboard", "Billing", "Contacts"];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="text-base font-bold text-gray-800 tracking-tight">AcmeCRM</div>
          <div className="text-xs text-gray-400 mt-0.5">{tenant.name}</div>
        </div>

        <nav className="flex-1 p-3">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full text-left px-3 py-2 rounded text-sm mb-0.5 cursor-pointer ${
                activePage === page
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        </nav>

        {/* User + tenant switchers */}
        <div className="p-3 border-t border-gray-200">
          <label className="text-xs text-gray-400 block mb-1">Current user</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 bg-white"
          >
            {tenant.users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.department}
              </option>
            ))}
          </select>

          <label className="text-xs text-gray-400 block mb-1 mt-3">Tenant</label>
          <select
            value={tenantId}
            onChange={(e) => switchTenant(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 bg-white"
          >
            {Object.values(TENANTS).map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-medium text-gray-800">{user.name}</span>
            <span className="text-sm text-gray-400 ml-2">{user.department}</span>
            {user.employmentType === "Contractor" && (
              <span className="text-xs ml-2 px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded">Contractor</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {!pageAccess.allowed ? (
            <AccessRestricted policyName={pageAccess.policyName} />
          ) : activePage === "Dashboard" ? (
            <DashboardPage canExport={exportAccess.allowed} />
          ) : activePage === "Billing" ? (
            <BillingPage />
          ) : (
            <ContactsPage canExport={exportAccess.allowed} />
          )}
        </div>
      </div>
    </div>
  );
}