
export const sampleRepositories = [
  "frontend-app",
  "backend-api",
  "infrastructure-as-code",
  "mobile-client",
  "data-analytics",
  "authentication-service",
  "payment-processor",
  "notification-service",
  "admin-dashboard",
  "user-service"
];

export const sampleSecretScanResults = [
  {
    repository: "frontend-app",
    scanCount: 3,
    findings: [
      {
        repository: "frontend-app",
        file: "src/config/api.js",
        line: 12,
        secret_type: "API Key",
        secret: "sk_test_51H******************************",
        commit: "a1b2c3d4e5f6g7h8i9j0",
        author: "alex.developer",
        date: "2023-10-15T10:32:19Z"
      },
      {
        repository: "frontend-app",
        file: ".env.development",
        line: 5,
        secret_type: "OAuth Token",
        secret: "gho_16C7e******************************",
        commit: "b2c3d4e5f6g7h8i9j0k1",
        author: "sam.architect",
        date: "2023-09-28T16:45:03Z"
      },
      {
        repository: "frontend-app",
        file: "cypress/fixtures/auth.json",
        line: 8,
        secret_type: "Test Credentials",
        secret: "{ username: 'test', password: 'Test********' }",
        commit: "c3d4e5f6g7h8i9j0k1l2",
        author: "test.engineer",
        date: "2023-11-02T09:17:44Z"
      }
    ]
  },
  {
    repository: "backend-api",
    scanCount: 2,
    findings: [
      {
        repository: "backend-api",
        file: "config/database.js",
        line: 23,
        secret_type: "Database Password",
        secret: "postgres://admin:P@ssw******@localhost:5432/appdb",
        commit: "d4e5f6g7h8i9j0k1l2m3",
        author: "database.admin",
        date: "2023-10-05T14:22:37Z"
      },
      {
        repository: "backend-api",
        file: "src/services/email.js",
        line: 7,
        secret_type: "SMTP Credentials",
        secret: "smtps://user:password@smtp.example.com",
        commit: "e5f6g7h8i9j0k1l2m3n4",
        author: "notification.service",
        date: "2023-11-10T11:05:29Z"
      }
    ]
  },
  {
    repository: "infrastructure-as-code",
    scanCount: 3,
    findings: [
      {
        repository: "infrastructure-as-code",
        file: "terraform/main.tf",
        line: 56,
        secret_type: "AWS Access Key",
        secret: "AKIA5J****************",
        commit: "f6g7h8i9j0k1l2m3n4o5",
        author: "devops.engineer",
        date: "2023-09-12T08:45:16Z"
      },
      {
        repository: "infrastructure-as-code",
        file: "ansible/vars/prod.yml",
        line: 34,
        secret_type: "SSH Private Key",
        secret: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQ******\n-----END RSA PRIVATE KEY-----",
        commit: "g7h8i9j0k1l2m3n4o5p6",
        author: "infrastructure.lead",
        date: "2023-10-20T15:33:42Z"
      },
      {
        repository: "infrastructure-as-code",
        file: ".env.terraform",
        line: 3,
        secret_type: "AWS Secret Key",
        secret: "wJal******************************",
        commit: "h8i9j0k1l2m3n4o5p6q7",
        author: "cloud.architect",
        date: "2023-11-05T16:27:58Z"
      }
    ]
  },
  {
    repository: "payment-processor",
    scanCount: 2,
    findings: [
      {
        repository: "payment-processor",
        file: "src/config/stripe.js",
        line: 7,
        secret_type: "Stripe Secret Key",
        secret: "sk_live_51******************************",
        commit: "i9j0k1l2m3n4o5p6q7r8",
        author: "payment.engineer",
        date: "2023-09-18T10:12:34Z"
      },
      {
        repository: "payment-processor",
        file: "tests/fixtures/payment_intents.json",
        line: 15,
        secret_type: "Test API Key",
        secret: "pi_test_******************************",
        commit: "j0k1l2m3n4o5p6q7r8s9",
        author: "qa.engineer",
        date: "2023-10-25T11:53:47Z"
      }
    ]
  },
  {
    repository: "admin-dashboard",
    scanCount: 1,
    findings: [
      {
        repository: "admin-dashboard",
        file: "src/services/auth.js",
        line: 42,
        secret_type: "JWT Secret",
        secret: "super_secret_jwt_token_signing_key_2023",
        commit: "k1l2m3n4o5p6q7r8s9t0",
        author: "security.engineer",
        date: "2023-11-15T09:42:18Z"
      }
    ]
  }
];

export const sampleSCAResults = [
  {
    repository: "frontend-app",
    critical: 1,
    high: 3,
    medium: 7,
    low: 12,
    alerts: [
      {
        package: "react-dom",
        version: "16.14.0",
        severity: "High",
        advisory: "Cross-site Scripting",
        cve: "CVE-2020-11023",
        fixedIn: "17.0.1"
      },
      {
        package: "axios",
        version: "0.21.1",
        severity: "Critical",
        advisory: "Server-Side Request Forgery",
        cve: "CVE-2021-3749",
        fixedIn: "0.21.2"
      },
      {
        package: "lodash",
        version: "4.17.15",
        severity: "High",
        advisory: "Prototype Pollution",
        cve: "CVE-2019-10744",
        fixedIn: "4.17.21"
      },
      {
        package: "webpack-dev-server",
        version: "3.10.3",
        severity: "Medium",
        advisory: "Directory Traversal",
        cve: "CVE-2018-14732",
        fixedIn: "3.11.0"
      }
    ]
  },
  {
    repository: "backend-api",
    critical: 2,
    high: 5,
    medium: 3,
    low: 8,
    alerts: [
      {
        package: "express",
        version: "4.17.1",
        severity: "Medium",
        advisory: "Regular Expression Denial of Service",
        cve: "CVE-2022-24999",
        fixedIn: "4.17.3"
      },
      {
        package: "mongoose",
        version: "5.12.3",
        severity: "High",
        advisory: "Server-Side Request Forgery",
        cve: "CVE-2022-2564",
        fixedIn: "5.13.0"
      },
      {
        package: "nodemailer",
        version: "6.4.16",
        severity: "Critical",
        advisory: "Command Injection",
        cve: "CVE-2021-32640",
        fixedIn: "6.4.18"
      },
      {
        package: "jsonwebtoken",
        version: "8.5.1",
        severity: "Critical",
        advisory: "Authentication Bypass",
        cve: "CVE-2022-23539",
        fixedIn: "8.5.2"
      }
    ]
  },
  {
    repository: "mobile-client",
    critical: 0,
    high: 2,
    medium: 5,
    low: 9,
    alerts: [
      {
        package: "react-native",
        version: "0.65.1",
        severity: "High",
        advisory: "Information Disclosure",
        cve: "CVE-2021-26720",
        fixedIn: "0.65.2"
      },
      {
        package: "react-native-webview",
        version: "11.13.0",
        severity: "Medium",
        advisory: "Cross-site Scripting",
        cve: "CVE-2021-43818",
        fixedIn: "11.14.0"
      },
      {
        package: "@react-native-async-storage/async-storage",
        version: "1.15.5",
        severity: "Medium",
        advisory: "Data Exposure",
        cve: "CVE-2021-23841",
        fixedIn: "1.15.6"
      }
    ]
  },
  {
    repository: "infrastructure-as-code",
    critical: 1,
    high: 1,
    medium: 2,
    low: 4,
    alerts: [
      {
        package: "terraform-aws-modules/vpc/aws",
        version: "3.11.0",
        severity: "Critical",
        advisory: "Insecure Default Configuration",
        cve: "CVE-2022-30121",
        fixedIn: "3.14.0"
      },
      {
        package: "hashicorp/aws",
        version: "3.74.0",
        severity: "High",
        advisory: "Privilege Escalation",
        cve: "CVE-2022-31099",
        fixedIn: "3.76.1"
      }
    ]
  },
  {
    repository: "payment-processor",
    critical: 3,
    high: 2,
    medium: 1,
    low: 5,
    alerts: [
      {
        package: "stripe",
        version: "8.222.0",
        severity: "Medium",
        advisory: "Information Disclosure",
        cve: "CVE-2022-24345",
        fixedIn: "8.222.1"
      },
      {
        package: "crypto-js",
        version: "4.1.1",
        severity: "Critical",
        advisory: "Timing Attack Vulnerability",
        cve: "CVE-2023-28858",
        fixedIn: "4.1.2"
      },
      {
        package: "express-validator",
        version: "6.12.1",
        severity: "High",
        advisory: "Input Validation Bypass",
        cve: "CVE-2022-24999",
        fixedIn: "6.14.0"
      },
      {
        package: "bcrypt",
        version: "5.0.1",
        severity: "Critical",
        advisory: "Timing Attack in Compare Function",
        cve: "CVE-2022-31159",
        fixedIn: "5.0.2"
      }
    ]
  }
];

export const sampleSBOMData = {
  packages: [
    {
      name: "express",
      version: "4.17.1",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-24999",
          severity: "Medium",
          description: "Regular Expression Denial of Service"
        }
      ]
    },
    {
      name: "react",
      version: "17.0.2",
      license: "MIT",
      vulnerabilities: []
    },
    {
      name: "axios",
      version: "0.21.1",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2021-3749",
          severity: "Critical",
          description: "Server-Side Request Forgery"
        }
      ]
    },
    {
      name: "lodash",
      version: "4.17.15",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2019-10744",
          severity: "High",
          description: "Prototype Pollution"
        }
      ]
    },
    {
      name: "bcrypt",
      version: "5.0.1",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-31159",
          severity: "Critical",
          description: "Timing Attack in Compare Function"
        }
      ]
    },
    {
      name: "moment",
      version: "2.29.1",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-31129",
          severity: "Medium",
          description: "Path Traversal"
        }
      ]
    },
    {
      name: "dotenv",
      version: "10.0.0",
      license: "BSD-2-Clause",
      vulnerabilities: []
    },
    {
      name: "next",
      version: "12.1.0",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-23633",
          severity: "High",
          description: "Open Redirect"
        }
      ]
    },
    {
      name: "mongoose",
      version: "5.12.3",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-2564",
          severity: "High",
          description: "Server-Side Request Forgery"
        }
      ]
    },
    {
      name: "node-fetch",
      version: "2.6.1",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-0235",
          severity: "Medium",
          description: "Exposure of Sensitive Information"
        }
      ]
    },
    {
      name: "cors",
      version: "2.8.5",
      license: "MIT",
      vulnerabilities: []
    },
    {
      name: "winston",
      version: "3.3.3",
      license: "MIT",
      vulnerabilities: []
    },
    {
      name: "passport",
      version: "0.5.0",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-23535",
          severity: "High",
          description: "Authentication Bypass"
        }
      ]
    },
    {
      name: "jsonwebtoken",
      version: "8.5.1",
      license: "MIT",
      vulnerabilities: [
        {
          cve: "CVE-2022-23539",
          severity: "Critical",
          description: "Authentication Bypass"
        }
      ]
    },
    {
      name: "pg",
      version: "8.7.1",
      license: "MIT",
      vulnerabilities: []
    }
  ]
};

export const summaryStats = {
  repositoriesScanned: 10,
  totalFindings: {
    critical: 8,
    high: 13,
    medium: 18,
    low: 38
  },
  topVulnerableRepositories: [
    { name: "frontend-app", findings: 23 },
    { name: "backend-api", findings: 18 },
    { name: "payment-processor", findings: 11 },
    { name: "infrastructure-as-code", findings: 8 },
    { name: "mobile-client", findings: 7 }
  ],
  scanTimeline: [
    { date: "2023-06-01", critical: 12, high: 18, medium: 24, low: 35 },
    { date: "2023-07-01", critical: 10, high: 16, medium: 22, low: 35 },
    { date: "2023-08-01", critical: 9, high: 15, medium: 20, low: 33 },
    { date: "2023-09-01", critical: 9, high: 14, medium: 19, low: 32 },
    { date: "2023-10-01", critical: 8, high: 14, medium: 19, low: 30 },
    { date: "2023-11-01", critical: 8, high: 13, medium: 18, low: 38 }
  ]
};
