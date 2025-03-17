
export type CodeReviewFinding = {
  id: string;
  repository: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  category: 'Security' | 'Quality' | 'Performance' | 'Maintainability';
  location: {
    file: string;
    line: number;
    endLine?: number;
  };
  codeSnippet: string;
  description: string;
  recommendation: string;
  references?: string[];
  remediation?: {
    effort: 'Low' | 'Medium' | 'High';
    priority: 'Immediate' | 'Short-term' | 'Long-term';
  };
  metadata?: {
    discoveredAt: string;
    detectionMethod: string;
  };
};

export const sampleCodeReviewFindings: CodeReviewFinding[] = [
  {
    id: "CR-2023-001",
    repository: "payment-service",
    title: "Insecure Direct Object Reference",
    severity: "High",
    category: "Security",
    location: {
      file: "src/controllers/payment.js",
      line: 78,
      endLine: 86
    },
    codeSnippet: `app.get('/user/:id/payments', (req, res) => {
  const userId = req.params.id;
  // No authorization check before accessing user data
  db.query('SELECT * FROM payments WHERE user_id = ?', [userId])
    .then(payments => {
      res.json(payments);
    });
});`,
    description: "The API endpoint retrieves payment data based solely on the user ID parameter without verifying if the requesting user has permission to access this data.",
    recommendation: "Implement proper authorization checks to ensure users can only access their own payment records. Use session information or tokens to validate the request.",
    references: [
      "https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control"
    ],
    remediation: {
      effort: "Low",
      priority: "Immediate"
    },
    metadata: {
      discoveredAt: "2023-04-15T14:23:10Z",
      detectionMethod: "Static Analysis"
    }
  },
  {
    id: "CR-2023-002",
    repository: "auth-service",
    title: "Weak Password Hashing Algorithm",
    severity: "Critical",
    category: "Security",
    location: {
      file: "src/utils/auth.js",
      line: 32
    },
    codeSnippet: `const hashPassword = (password) => {
  return crypto.createHash('md5').update(password).digest('hex');
};`,
    description: "The application uses MD5 for password hashing, which is cryptographically broken and unsuitable for secure password storage.",
    recommendation: "Replace MD5 with a modern, specialized password hashing algorithm like bcrypt, Argon2, or PBKDF2 with appropriate work factors.",
    references: [
      "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
    ],
    remediation: {
      effort: "Low",
      priority: "Immediate"
    },
    metadata: {
      discoveredAt: "2023-04-15T14:45:22Z",
      detectionMethod: "Pattern Matching"
    }
  },
  {
    id: "CR-2023-003",
    repository: "web-frontend",
    title: "Cross-Site Scripting (XSS) Vulnerability",
    severity: "High",
    category: "Security",
    location: {
      file: "src/components/Comments.jsx",
      line: 45
    },
    codeSnippet: `<div dangerouslySetInnerHTML={{ __html: comment.text }} />`,
    description: "User-provided comment content is rendered directly to the DOM using dangerouslySetInnerHTML without sanitization, allowing potential XSS attacks.",
    recommendation: "Use a library like DOMPurify to sanitize user input before rendering it to the DOM, or avoid dangerouslySetInnerHTML and use safer alternatives.",
    references: [
      "https://owasp.org/www-community/attacks/xss/"
    ],
    remediation: {
      effort: "Low",
      priority: "Immediate"
    },
    metadata: {
      discoveredAt: "2023-04-15T15:10:45Z",
      detectionMethod: "Pattern Matching"
    }
  },
  {
    id: "CR-2023-004",
    repository: "api-gateway",
    title: "Missing Rate Limiting",
    severity: "Medium",
    category: "Security",
    location: {
      file: "src/server.js",
      line: 12,
      endLine: 20
    },
    codeSnippet: `// Server setup without rate limiting
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);`,
    description: "The API endpoints lack rate limiting protection, making the service vulnerable to brute force attacks and potential DoS.",
    recommendation: "Implement rate limiting middleware like 'express-rate-limit' to restrict the number of requests a client can make within a specified time window.",
    references: [
      "https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html"
    ],
    remediation: {
      effort: "Low",
      priority: "Short-term"
    },
    metadata: {
      discoveredAt: "2023-04-15T16:05:12Z",
      detectionMethod: "Static Analysis"
    }
  },
  {
    id: "CR-2023-005",
    repository: "notification-service",
    title: "Inefficient Database Query",
    severity: "Medium",
    category: "Performance",
    location: {
      file: "src/services/notification.js",
      line: 87
    },
    codeSnippet: `const getActiveUsers = async () => {
  // Fetches all users and filters in-memory
  const allUsers = await db.query('SELECT * FROM users');
  return allUsers.filter(user => user.active === true);
};`,
    description: "The function retrieves all user records and then filters them in application memory, which is inefficient and doesn't scale well with a growing user base.",
    recommendation: "Move the filtering logic to the database query to reduce data transfer and improve performance: 'SELECT * FROM users WHERE active = true'",
    references: [],
    remediation: {
      effort: "Low",
      priority: "Short-term"
    },
    metadata: {
      discoveredAt: "2023-04-15T16:30:05Z",
      detectionMethod: "Code Review"
    }
  },
  {
    id: "CR-2023-006",
    repository: "user-service",
    title: "Hardcoded API Keys",
    severity: "Critical",
    category: "Security",
    location: {
      file: "src/services/thirdPartyApi.js",
      line: 15
    },
    codeSnippet: `const apiClient = new ThirdPartyApiClient({
  apiKey: 'sk_live_Tc1BFtvgh67JKl39dNgHs92Z',
  apiSecret: '9f8g7h6j5k4l3m2n1o'
});`,
    description: "API keys and secrets are hardcoded in the source code, exposing sensitive credentials that could be compromised if the code is leaked or accessed by unauthorized parties.",
    recommendation: "Move API keys and secrets to environment variables or a secure vault, and ensure they are not committed to version control.",
    references: [
      "https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"
    ],
    remediation: {
      effort: "Low",
      priority: "Immediate"
    },
    metadata: {
      discoveredAt: "2023-04-16T09:15:45Z",
      detectionMethod: "Secret Scanning"
    }
  },
  {
    id: "CR-2023-007",
    repository: "data-processing",
    title: "SQL Injection Vulnerability",
    severity: "Critical",
    category: "Security",
    location: {
      file: "src/services/reports.js",
      line: 42
    },
    codeSnippet: `function generateCustomReport(userId, filters) {
  const query = \`SELECT * FROM user_data WHERE user_id = '\${userId}' AND \${filters}\`;
  return db.raw(query);
}`,
    description: "Dynamic SQL query construction using string interpolation creates a high risk of SQL injection attacks, especially with the filters parameter.",
    recommendation: "Use parameterized queries with proper variable binding instead of string interpolation. Consider using an ORM or query builder that handles SQL injection protection.",
    references: [
      "https://owasp.org/www-community/attacks/SQL_Injection",
      "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
    ],
    remediation: {
      effort: "Medium",
      priority: "Immediate"
    },
    metadata: {
      discoveredAt: "2023-04-16T10:40:18Z",
      detectionMethod: "Static Analysis"
    }
  },
  {
    id: "CR-2023-008",
    repository: "web-frontend",
    title: "Excessive Re-rendering in React Component",
    severity: "Low",
    category: "Performance",
    location: {
      file: "src/components/Dashboard.jsx",
      line: 28,
      endLine: 45
    },
    codeSnippet: `function UserDashboard({ userId }) {
  const [data, setData] = useState({});
  
  // This effect runs on every render because of the empty object dependency
  useEffect(() => {
    fetchUserData(userId).then(setData);
  }, [userId, {}]);  // Empty object as dependency
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
}`,
    description: "The component includes an empty object as a dependency in the useEffect hook, causing unnecessary re-renders on every component update because the object reference changes each time.",
    recommendation: "Remove the empty object from the dependency array. Only include stable dependencies like 'userId'. Consider using useMemo for complex dependencies.",
    references: [
      "https://reactjs.org/docs/hooks-effect.html"
    ],
    remediation: {
      effort: "Low",
      priority: "Short-term"
    },
    metadata: {
      discoveredAt: "2023-04-16T11:25:33Z",
      detectionMethod: "Code Review"
    }
  },
  {
    id: "CR-2023-009",
    repository: "logging-service",
    title: "Insufficient Error Handling",
    severity: "Medium",
    category: "Quality",
    location: {
      file: "src/services/logger.js",
      line: 64
    },
    codeSnippet: `async function logEvent(eventData) {
  try {
    await db.insert('events', eventData);
  } catch (error) {
    console.error('Failed to log event');
    // No error details captured, error swallowed
  }
}`,
    description: "The error handling simply logs a generic message without capturing error details, making debugging difficult. The function also swallows errors rather than propagating them.",
    recommendation: "Enhance error handling to log detailed error information including the original message and stack trace. Consider adding a fallback logging mechanism and/or propagating errors where appropriate.",
    references: [],
    remediation: {
      effort: "Low",
      priority: "Short-term"
    },
    metadata: {
      discoveredAt: "2023-04-16T13:45:10Z",
      detectionMethod: "Code Review"
    }
  },
  {
    id: "CR-2023-010",
    repository: "admin-dashboard",
    title: "Code Duplication in Authentication",
    severity: "Low",
    category: "Maintainability",
    location: {
      file: "src/utils/auth.js",
      line: 120,
      endLine: 142
    },
    codeSnippet: `// Similar authentication logic appears in multiple files
function validateUserAccess(user, resource) {
  if (!user || !user.roles) return false;
  
  if (user.roles.includes('admin')) return true;
  
  if (resource.ownerId === user.id) return true;
  
  if (user.permissions && user.permissions.includes(\`access:\${resource.type}\`)) return true;
  
  return false;
}`,
    description: "Similar authentication and authorization logic is duplicated across multiple files in the application, making maintenance difficult and increasing the risk of inconsistent implementation.",
    recommendation: "Extract the authentication and authorization logic into a shared utility module. Consider implementing a dedicated authorization service or using a library like Casbin for complex permission requirements.",
    references: [],
    remediation: {
      effort: "Medium",
      priority: "Long-term"
    },
    metadata: {
      discoveredAt: "2023-04-17T09:20:42Z",
      detectionMethod: "Code Similarity Analysis"
    }
  }
];

export const codeReviewSummary = {
  totalIssues: sampleCodeReviewFindings.length,
  severityCounts: {
    Critical: sampleCodeReviewFindings.filter(v => v.severity === 'Critical').length,
    High: sampleCodeReviewFindings.filter(v => v.severity === 'High').length,
    Medium: sampleCodeReviewFindings.filter(v => v.severity === 'Medium').length,
    Low: sampleCodeReviewFindings.filter(v => v.severity === 'Low').length,
    Info: sampleCodeReviewFindings.filter(v => v.severity === 'Info').length,
  },
  categoryCounts: {
    Security: sampleCodeReviewFindings.filter(v => v.category === 'Security').length,
    Quality: sampleCodeReviewFindings.filter(v => v.category === 'Quality').length,
    Performance: sampleCodeReviewFindings.filter(v => v.category === 'Performance').length,
    Maintainability: sampleCodeReviewFindings.filter(v => v.category === 'Maintainability').length,
  },
  repositoryCounts: sampleCodeReviewFindings.reduce((acc, v) => {
    acc[v.repository] = (acc[v.repository] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};
