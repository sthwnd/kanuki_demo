import { PRODUCT_SCHEMA } from "./data.js";

// Build the prompt context from known schema and tenant org
function buildPromptContext(tenant) {
  const resources = PRODUCT_SCHEMA.resources.map(
    (r) => `${r.name}: [${r.actions.join(", ")}]`
  ).join("\n");

  const attributes = tenant.attributes.map(
    (a) => `${a.name}: [${a.values.join(", ")}]`
  ).join("\n");

  const users = tenant.users.map(
    (u) => `${u.name} (Department: ${u.department}, Employment Type: ${u.employmentType})`
  ).join("\n");

  return { resources, attributes, users };
}

// Call Claude API to translate natural language → structured policy
export async function translatePolicy(request, tenant, apiKey) {
  const ctx = buildPromptContext(tenant);

  const systemPrompt = `You are a deterministic policy translation engine. You convert natural language access policy requests into structured policy objects.

KNOWN PRODUCT SCHEMA (AcmeCRM):
Resources and actions:
${ctx.resources}

KNOWN CUSTOMER ORG (${tenant.name}):
Attributes:
${ctx.attributes}

Users:
${ctx.users}

RULES:
- Only use resources, actions, attributes, and values that exist above
- Calculate exact impact by checking each user against the condition
- Return ONLY valid JSON, no markdown, no explanation

Return this exact JSON structure:
{
  "name": "Short policy name",
  "resource": "Exact resource name from schema",
  "action": "Exact action name from schema",
  "attribute": "Exact attribute name from org",
  "operator": "equals",
  "value": "Exact value from org",
  "effect": "allow_only or deny",
  "impact": {
    "retain": ["Full Name 1", "Full Name 2"],
    "lose": ["Full Name 3", "Full Name 4"]
  },
  "conflicts": []
}

For effect: use "allow_only" when only matching users should have access (deny everyone else). Use "deny" when matching users should be blocked (allow everyone else).`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: request }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${response.status} — ${err}`);
  }

  const data = await response.json();
  const text = data.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  // Strip markdown fences if present, parse JSON
  const clean = text.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(clean);
}