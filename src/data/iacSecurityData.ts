
export type IacSecurityResult = {
  checkId: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  resource: string;
  file: string;
  description: string;
  codeSnippet: string;
  remediation: {
    summary: string;
    guide: string;
  };
};

export const iacSecurityResults: IacSecurityResult[] = [
  {
    checkId: "CKV_ALI_6",
    title: "Ensure OSS bucket is encrypted with Customer Master Key",
    severity: "High",
    resource: "alicloud_oss_bucket.bad_bucket",
    file: "/terraform/alicloud/bucket.tf:1-18",
    description: "This bucket lacks encryption with a Customer Master Key, making it vulnerable to unauthorized data access.",
    codeSnippet: `resource "alicloud_oss_bucket" "bad_bucket" {
  # Public and writable bucket 
  # Versioning isn't enabled
  # Not Encrypted with a Customer Master Key and no Server side encryption
  # Doesn't have access logging enabled
  bucket = "wildwestfreeforall"
  acl    = "public-read-write"
  tags = {
    git_commit           = "9c114f23d311f787c137723e1f71b27a52f0adec"
    git_file             = "terraform/alicloud/bucket.tf"
    git_last_modified_at = "2022-04-05 15:17:55"
    git_last_modified_by = "james.woolfenden@gmail.com"
    git_modifiers        = "james.woolfenden"
    git_org              = "bridgecrewio"
    git_repo             = "terragoat"
    yor_trace            = "80373049-248d-4f5e-9d25-740c3e80f2b9"
  }
}`,
    remediation: {
      summary: "Enable encryption using Customer Master Key (CMK)",
      guide: "https://docs.prismacloud.io/en/enterprise-edition/policy-reference/alibaba-policies/alibaba-general-policies/ensure-alibaba-cloud-oss-bucket-is-encrypted-with-customer-master-key"
    }
  },
  {
    checkId: "CKV_AWS_18",
    title: "Ensure S3 bucket has access logging enabled",
    severity: "Medium",
    resource: "aws_s3_bucket.data",
    file: "/terraform/aws/s3.tf:5-20",
    description: "Access logging is not enabled for this S3 bucket, which limits your ability to track access and identify potential security incidents.",
    codeSnippet: `resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
  acl    = "private"
  
  versioning {
    enabled = true
  }
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  
  # Missing access logging configuration
}`,
    remediation: {
      summary: "Enable access logging for the S3 bucket",
      guide: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html"
    }
  },
  {
    checkId: "CKV_AZURE_2",
    title: "Ensure storage account secure transfer is enabled",
    severity: "Critical",
    resource: "azurerm_storage_account.example",
    file: "/terraform/azure/storage.tf:1-10",
    description: "Storage account is not configured to require secure transfer (HTTPS), allowing data to be transmitted in plaintext.",
    codeSnippet: `resource "azurerm_storage_account" "example" {
  name                     = "storageaccountname"
  resource_group_name      = azurerm_resource_group.example.name
  location                 = azurerm_resource_group.example.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  # Missing enable_https_traffic_only = true
  # This makes data transmission insecure
}`,
    remediation: {
      summary: "Set enable_https_traffic_only to true",
      guide: "https://docs.microsoft.com/en-us/azure/storage/common/storage-require-secure-transfer"
    }
  }
];
