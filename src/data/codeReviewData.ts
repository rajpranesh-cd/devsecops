
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
    ]
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
    ]
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
    ]
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
    ]
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
    references: []
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
