
export type SastVulnerability = {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  location: {
    file: string;
    line: number;
  };
  codeSnippet: string;
  cwe: string;
  owasp: string;
  remediation: string;
};

export const sastResults: SastVulnerability[] = [
  {
    id: "VULN-2025-001",
    severity: "High",
    description: "SQL Injection vulnerability detected in database query",
    location: {
      file: "src/database/queryHandler.js",
      line: 45
    },
    codeSnippet: "db.query(`SELECT * FROM users WHERE id = ${userId}`);",
    cwe: "CWE-89",
    owasp: "https://owasp.org/www-community/attacks/SQL_Injection",
    remediation: "Use parameterized queries or prepared statements to prevent SQL injection"
  },
  {
    id: "VULN-2025-002",
    severity: "Critical",
    description: "Hardcoded credentials found in configuration file",
    location: {
      file: "src/config/database.js",
      line: 12
    },
    codeSnippet: "const dbPassword = 'admin123';",
    cwe: "CWE-798",
    owasp: "https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password",
    remediation: "Move sensitive credentials to environment variables or secure secret storage"
  },
  {
    id: "VULN-2025-003",
    severity: "Medium",
    description: "Insecure random number generation",
    location: {
      file: "src/utils/random.js",
      line: 23
    },
    codeSnippet: "const token = Math.random().toString(36).substring(7);",
    cwe: "CWE-338",
    owasp: "https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length",
    remediation: "Use cryptographically secure random number generation (crypto.randomBytes)"
  }
];

export const sastSummary = {
  totalIssues: sastResults.length,
  severityCounts: {
    Critical: sastResults.filter(v => v.severity === 'Critical').length,
    High: sastResults.filter(v => v.severity === 'High').length,
    Medium: sastResults.filter(v => v.severity === 'Medium').length,
    Low: sastResults.filter(v => v.severity === 'Low').length
  }
};
