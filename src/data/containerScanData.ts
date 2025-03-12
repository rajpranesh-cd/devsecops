
export type Vulnerability = {
  id: string;
  package_name: string;
  package_version: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  fixed_version: string;
  link: string;
};

export type ComplianceIssue = {
  id: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  remediation: string;
};

export type ContainerScanResult = {
  image_name: string;
  image_digest: string;
  scan_date: string;
  vulnerabilities: Vulnerability[];
  compliance_issues: ComplianceIssue[];
  metadata: {
    os: string;
    size: string;
    created_by: string;
    layers: string[];
  };
};

export const containerScanResults: ContainerScanResult[] = [
  {
    image_name: "frontend-app:latest",
    image_digest: "sha256:e8f23f843df67f7ab5d9a34684d581cc1bdd58ab76f88e9",
    scan_date: "2025-02-15T09:30:00Z",
    vulnerabilities: [
      {
        id: "CVE-2023-45678",
        package_name: "openssl",
        package_version: "1.1.1k",
        severity: "High",
        description: "A vulnerability in OpenSSL that allows for buffer overflow attacks through crafted certificates",
        fixed_version: "1.1.1l",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2023-45678"
      },
      {
        id: "CVE-2024-12345",
        package_name: "node",
        package_version: "16.13.0",
        severity: "Medium",
        description: "Out-of-bounds read in HTTP request handling that could lead to information disclosure",
        fixed_version: "16.13.2",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2024-12345"
      }
    ],
    compliance_issues: [
      {
        id: "CIS-4.1.2",
        description: "Ensure unnecessary packages are not installed in the container",
        severity: "Medium",
        remediation: "Remove debug tools and other unnecessary packages from the final image"
      }
    ],
    metadata: {
      os: "node:16-alpine",
      size: "350MB",
      created_by: "Docker version 20.10.12, build e91ed57",
      layers: [
        "sha256:layer1e8f23f843df67f7ab5d9a34684d581cc1bdd58ab76f88e9",
        "sha256:layer2e8f23f843df67f7ab5d9a34684d581cc1bdd58ab76f88e9"
      ]
    }
  },
  {
    image_name: "backend-api:v2.1",
    image_digest: "sha256:a9c6d3e2b1d58fc987ab2d581cc12bdd58ab76f88e9f23f843",
    scan_date: "2025-02-16T14:45:00Z",
    vulnerabilities: [
      {
        id: "CVE-2023-56789",
        package_name: "python",
        package_version: "3.9.5",
        severity: "Critical",
        description: "Remote code execution vulnerability in the Python interpreter",
        fixed_version: "3.9.7",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2023-56789"
      },
      {
        id: "CVE-2023-54321",
        package_name: "flask",
        package_version: "2.0.1",
        severity: "High",
        description: "Cross-site scripting vulnerability in Flask template rendering",
        fixed_version: "2.0.3",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2023-54321"
      },
      {
        id: "CVE-2024-98765",
        package_name: "sqlalchemy",
        package_version: "1.4.23",
        severity: "Medium",
        description: "SQL injection vulnerability when using raw SQL with certain dialect options",
        fixed_version: "1.4.25",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2024-98765"
      }
    ],
    compliance_issues: [
      {
        id: "CIS-5.2.3",
        description: "Ensure that the Docker daemon is configured to use TLS authentication",
        severity: "Critical",
        remediation: "Configure the Docker daemon to use TLS by following the official Docker documentation"
      },
      {
        id: "CIS-4.2.1",
        description: "Ensure that a user for the container has been created",
        severity: "High",
        remediation: "Create a non-root user in the Dockerfile and use the USER directive to switch to it"
      }
    ],
    metadata: {
      os: "python:3.9-slim",
      size: "475MB",
      created_by: "Docker version 20.10.12, build e91ed57",
      layers: [
        "sha256:layer1a9c6d3e2b1d58fc987ab2d581cc12bdd58ab76f88e9f23",
        "sha256:layer2a9c6d3e2b1d58fc987ab2d581cc12bdd58ab76f88e9f23",
        "sha256:layer3a9c6d3e2b1d58fc987ab2d581cc12bdd58ab76f88e9f23"
      ]
    }
  },
  {
    image_name: "data-processor:1.0",
    image_digest: "sha256:7b21cd8e9f23f843df67f7ab5d9a34684d581cc1bdd58ab76",
    scan_date: "2025-02-17T11:15:00Z",
    vulnerabilities: [
      {
        id: "CVE-2023-67890",
        package_name: "java",
        package_version: "11.0.11",
        severity: "Medium",
        description: "Information disclosure vulnerability in JVM garbage collection",
        fixed_version: "11.0.12",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2023-67890"
      },
      {
        id: "CVE-2024-24680",
        package_name: "log4j",
        package_version: "2.14.1",
        severity: "Critical",
        description: "Remote code execution vulnerability in log message processing",
        fixed_version: "2.17.0",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2024-24680"
      }
    ],
    compliance_issues: [],
    metadata: {
      os: "openjdk:11-slim",
      size: "520MB",
      created_by: "Docker version 20.10.14, build a224086",
      layers: [
        "sha256:layer17b21cd8e9f23f843df67f7ab5d9a34684d581cc1bdd58a",
        "sha256:layer27b21cd8e9f23f843df67f7ab5d9a34684d581cc1bdd58a"
      ]
    }
  },
  {
    image_name: "auth-service:2.3",
    image_digest: "sha256:3e4f12d6d8fc987ab2d581cc1bdd58ab76f88e9f23f843df6",
    scan_date: "2025-02-18T16:20:00Z",
    vulnerabilities: [
      {
        id: "CVE-2023-13579",
        package_name: "nginx",
        package_version: "1.20.1",
        severity: "Low",
        description: "Information disclosure through error pages",
        fixed_version: "1.20.2",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2023-13579"
      }
    ],
    compliance_issues: [
      {
        id: "CIS-4.1.3",
        description: "Ensure that the Dockerfile uses COPY instead of ADD",
        severity: "Low",
        remediation: "Replace ADD instructions with COPY in your Dockerfile"
      }
    ],
    metadata: {
      os: "debian:11",
      size: "280MB",
      created_by: "Docker version 20.10.12, build e91ed57",
      layers: [
        "sha256:layer13e4f12d6d8fc987ab2d581cc1bdd58ab76f88e9f23f84",
        "sha256:layer23e4f12d6d8fc987ab2d581cc1bdd58ab76f88e9f23f84"
      ]
    }
  },
  {
    image_name: "cache-service:latest",
    image_digest: "sha256:9c8d7e5f12d6d8fc987ab2d581cc1bdd58ab76f88e9f23f8",
    scan_date: "2025-02-19T08:50:00Z",
    vulnerabilities: [
      {
        id: "CVE-2023-98765",
        package_name: "redis",
        package_version: "6.0.15",
        severity: "High",
        description: "Memory corruption vulnerability in Redis LIST handling",
        fixed_version: "6.0.16",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2023-98765"
      },
      {
        id: "CVE-2024-54321",
        package_name: "libc",
        package_version: "2.31-13",
        severity: "Critical",
        description: "Buffer overflow in string handling functions",
        fixed_version: "2.31-14",
        link: "https://nvd.nist.gov/vuln/detail/CVE-2024-54321"
      }
    ],
    compliance_issues: [
      {
        id: "CIS-5.1.2",
        description: "Ensure that the container's root filesystem is mounted as read-only",
        severity: "High",
        remediation: "Configure the container to use a read-only root filesystem with appropriate volume mounts for writable directories"
      }
    ],
    metadata: {
      os: "redis:6.0-alpine",
      size: "110MB",
      created_by: "Docker version 20.10.14, build a224086",
      layers: [
        "sha256:layer19c8d7e5f12d6d8fc987ab2d581cc1bdd58ab76f88e9f2",
        "sha256:layer29c8d7e5f12d6d8fc987ab2d581cc1bdd58ab76f88e9f2"
      ]
    }
  }
];

// Calculate summary statistics
export const containerScanSummary = {
  totalImages: containerScanResults.length,
  totalVulnerabilities: containerScanResults.reduce(
    (sum, result) => sum + result.vulnerabilities.length, 
    0
  ),
  totalComplianceIssues: containerScanResults.reduce(
    (sum, result) => sum + result.compliance_issues.length, 
    0
  ),
  vulnerabilitiesBySeverity: {
    Critical: containerScanResults.reduce(
      (sum, result) => sum + result.vulnerabilities.filter(v => v.severity === 'Critical').length, 
      0
    ),
    High: containerScanResults.reduce(
      (sum, result) => sum + result.vulnerabilities.filter(v => v.severity === 'High').length, 
      0
    ),
    Medium: containerScanResults.reduce(
      (sum, result) => sum + result.vulnerabilities.filter(v => v.severity === 'Medium').length, 
      0
    ),
    Low: containerScanResults.reduce(
      (sum, result) => sum + result.vulnerabilities.filter(v => v.severity === 'Low').length, 
      0
    ),
  }
};
