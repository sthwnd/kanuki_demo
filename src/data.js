// Known product schema — what Kanuki "discovered" about AcmeCRM
export const PRODUCT_SCHEMA = {
    name: "AcmeCRM",
    resources: [
      { name: "Dashboard", actions: ["View", "Export CSV"] },
      { name: "Billing", actions: ["View"] },
      { name: "Contacts", actions: ["View", "Export CSV"] },
    ],
  };
  
  // Two tenants with distinct org structures
  export const TENANTS = {
    regal: {
      id: "regal",
      name: "Regal Pharmaceuticals",
      industry: "Pharmaceutical",
      color: "#1a5c3a",
      attributes: [
        { name: "Department", values: ["Finance", "Sales", "Engineering", "Legal"] },
      ],
      users: [
        { id: "sarah", name: "Sarah Cohen", department: "Finance", employmentType: "Full-time" },
        { id: "mike", name: "Mike Torres", department: "Sales", employmentType: "Full-time" },
        { id: "david", name: "David Kim", department: "Finance", employmentType: "Full-time" },
        { id: "rachel", name: "Rachel Levy", department: "Finance", employmentType: "Full-time" },
        { id: "tom", name: "Tom Nguyen", department: "Finance", employmentType: "Full-time" },
        { id: "anna", name: "Anna Weber", department: "Engineering", employmentType: "Full-time" },
        { id: "james_r", name: "James Park", department: "Engineering", employmentType: "Full-time" },
        { id: "lisa_r", name: "Lisa Chen", department: "Engineering", employmentType: "Full-time" },
        { id: "omar", name: "Omar Hassan", department: "Sales", employmentType: "Full-time" },
        { id: "nina", name: "Nina Petrov", department: "Sales", employmentType: "Full-time" },
        { id: "alex", name: "Alex Murphy", department: "Sales", employmentType: "Full-time" },
        { id: "yuki", name: "Yuki Tanaka", department: "Legal", employmentType: "Full-time" },
        { id: "maria", name: "Maria Santos", department: "Legal", employmentType: "Full-time" },
        { id: "ben", name: "Ben Adler", department: "Legal", employmentType: "Full-time" },
        { id: "clara", name: "Clara Johansson", department: "Engineering", employmentType: "Full-time" },
        { id: "ravi", name: "Ravi Patel", department: "Sales", employmentType: "Full-time" },
      ],
    },
    verdant: {
      id: "verdant",
      name: "Verdant Engineering",
      industry: "Engineering Consultancy",
      color: "#4a3d8f",
      attributes: [
        { name: "Department", values: ["Civil", "Structural", "Electrical"] },
        { name: "Employment Type", values: ["Full-time", "Contractor"] },
      ],
      users: [
        { id: "dana", name: "Dana Reeves", department: "Civil", employmentType: "Full-time" },
        { id: "james_v", name: "James Ward", department: "Structural", employmentType: "Contractor" },
        { id: "sophia", name: "Sophia Lin", department: "Civil", employmentType: "Full-time" },
        { id: "carlos", name: "Carlos Mendez", department: "Electrical", employmentType: "Full-time" },
        { id: "priya", name: "Priya Sharma", department: "Structural", employmentType: "Full-time" },
        { id: "ethan", name: "Ethan Brooks", department: "Civil", employmentType: "Contractor" },
        { id: "maya_v", name: "Maya Johnson", department: "Electrical", employmentType: "Full-time" },
        { id: "liam", name: "Liam O'Brien", department: "Structural", employmentType: "Full-time" },
        { id: "aisha", name: "Aisha Mohammed", department: "Civil", employmentType: "Full-time" },
        { id: "ryan", name: "Ryan Cooper", department: "Electrical", employmentType: "Contractor" },
        { id: "helena", name: "Helena Frost", department: "Structural", employmentType: "Full-time" },
      ],
    },
  };
  
  // Static CRM page data
  export const DASHBOARD_DATA = {
    revenue: "$2.4M",
    activeDeals: 47,
    pipeline: "$8.1M",
    closedThisMonth: 12,
  };
  
  export const BILLING_DATA = [
    { id: 1, client: "Meridian Health Systems", amount: "$45,200", date: "2026-01-28", status: "Paid" },
    { id: 2, client: "NovaTech Solutions", amount: "$128,500", date: "2026-01-22", status: "Pending" },
    { id: 3, client: "Pacific Dynamics", amount: "$67,800", date: "2026-01-15", status: "Paid" },
    { id: 4, client: "Apex Manufacturing", amount: "$93,100", date: "2026-01-08", status: "Overdue" },
    { id: 5, client: "Crestview Partners", amount: "$31,400", date: "2025-12-30", status: "Paid" },
    { id: 6, client: "Horizon Logistics", amount: "$56,700", date: "2025-12-18", status: "Paid" },
  ];
  
  export const CONTACTS_DATA = [
    { id: 1, name: "Jennifer Walsh", email: "j.walsh@meridianhealth.com", company: "Meridian Health Systems", role: "VP Procurement" },
    { id: 2, name: "Marcus Chen", email: "m.chen@novatech.io", company: "NovaTech Solutions", role: "CTO" },
    { id: 3, name: "Samantha Okafor", email: "s.okafor@pacificdyn.com", company: "Pacific Dynamics", role: "Head of Ops" },
    { id: 4, name: "Robert Jimenez", email: "r.jimenez@apexmfg.com", company: "Apex Manufacturing", role: "CFO" },
    { id: 5, name: "Anika Patel", email: "a.patel@crestview.co", company: "Crestview Partners", role: "Managing Director" },
    { id: 6, name: "Thomas Eriksson", email: "t.eriksson@horizonlog.com", company: "Horizon Logistics", role: "Supply Chain Lead" },
  ];