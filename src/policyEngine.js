// Resolve user attribute value from policy's attribute name
function getUserAttribute(user, attributeName) {
    if (attributeName === "Department") return user.department;
    if (attributeName === "Employment Type") return user.employmentType;
    return null;
  }
  
  // Check if a single policy allows or denies a user
  function evaluatePolicy(policy, user) {
    const value = getUserAttribute(user, policy.attribute);
    if (value === null) return true;
  
    if (policy.effect === "allow_only") {
      return policy.operator === "equals" && value === policy.value;
    }
  
    if (policy.effect === "deny") {
      if (policy.operator === "equals") return value !== policy.value;
      if (policy.operator === "not_equals") return value === policy.value;
    }
  
    return true;
  }
  
  // Main access check — returns { allowed, policyName? }
  export function checkAccess(policies, user, tenantId, resource, action) {
    const relevant = policies.filter(
      (p) => p.tenantId === tenantId && p.resource === resource && p.action === action
    );
  
    for (const policy of relevant) {
      if (!evaluatePolicy(policy, user)) {
        return { allowed: false, policyName: policy.name };
      }
    }
  
    return { allowed: true };
  }