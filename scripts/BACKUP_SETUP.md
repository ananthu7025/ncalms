# Database Backup to S3 - Setup Guide

This guide will help you set up automated daily database backups to AWS S3 for your PostgreSQL database.

## Prerequisites

1. Ubuntu server with PostgreSQL installed
2. AWS account with S3 access
3. PostgreSQL client tools (`pg_dump`)
4. AWS CLI installed

## Setup Instructions

### 1. Install Required Tools

```bash
# Install PostgreSQL client (if not already installed)
sudo apt update
sudo apt install -y postgresql-client

# Install AWS CLI
sudo apt install -y awscli

# Or install the latest AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### 2. Configure AWS Credentials

You have two options:

#### Option A: Using IAM Role (Recommended for EC2)

1. Create an IAM role with S3 access:
   - Go to AWS Console → IAM → Roles → Create Role
   - Select "AWS service" → "EC2"
   - Attach policy: `AmazonS3FullAccess` (or create a custom policy with limited permissions)
   - Name the role (e.g., `ec2-s3-backup-role`)
   - Attach the role to your EC2 instance

2. Custom IAM Policy (Minimal Permissions):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::your-backup-bucket-name",
                "arn:aws:s3:::your-backup-bucket-name/*"
            ]
        }
    ]
}
```

#### Option B: Using AWS Access Keys

```bash
# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter default output format (json)
```

### 3. Create S3 Bucket

```bash
# Create S3 bucket for backups
aws s3 mb s3://your-backup-bucket-name --region us-east-1

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
    --bucket your-backup-bucket-name \
    --versioning-configuration Status=Enabled

# Enable encryption (optional but recommended)
aws s3api put-bucket-encryption \
    --bucket your-backup-bucket-name \
    --server-side-encryption-configuration '{
        "Rules": [{
            "ApplyServerSideEncryptionByDefault": {
                "SSEAlgorithm": "AES256"
            }
        }]
    }'
```

### 4. Deploy Backup Script to Server

1. Copy the scripts to your Ubuntu server:

```bash
# On your local machine, upload to server
scp scripts/db-backup.sh ubuntu@your-server-ip:/home/ubuntu/
scp scripts/.backup.env.example ubuntu@your-server-ip:/home/ubuntu/
```

2. On the Ubuntu server:

```bash
# Create scripts directory
sudo mkdir -p /opt/db-backup
sudo mv /home/ubuntu/db-backup.sh /opt/db-backup/
sudo chmod +x /opt/db-backup/db-backup.sh

# Create environment file
sudo cp /home/ubuntu/.backup.env.example /opt/db-backup/.backup.env
sudo nano /opt/db-backup/.backup.env
# Edit and fill in your actual values
```

### 5. Configure Environment Variables

Edit `/opt/db-backup/.backup.env`:

```bash
# Example configuration
DATABASE_URL=postgresql://dbuser:dbpassword@localhost:5432/nca_lms
S3_BUCKET_NAME=my-database-backups
AWS_REGION=us-east-1
BACKUP_DIR=/tmp/db-backups
RETENTION_DAYS=7
LOG_FILE=/var/log/db-backup.log
```

### 6. Create Log Directory

```bash
# Create log file and set permissions
sudo touch /var/log/db-backup.log
sudo chmod 644 /var/log/db-backup.log

# If using a specific user for backups
sudo chown ubuntu:ubuntu /var/log/db-backup.log
```

### 7. Test the Backup Script

```bash
# Run the script manually to test
sudo /opt/db-backup/db-backup.sh

# Check the log file
cat /var/log/db-backup.log

# Verify backup was uploaded to S3
aws s3 ls s3://your-backup-bucket-name/backups/
```

### 8. Set Up Cron Job

1. Open crontab for editing:

```bash
sudo crontab -e
```

2. Add one of these cron entries:

```bash
# Option 1: Run daily at 2:00 AM
0 2 * * * /opt/db-backup/db-backup.sh >> /var/log/db-backup.log 2>&1

# Option 2: Run daily at 3:30 AM
30 3 * * * /opt/db-backup/db-backup.sh >> /var/log/db-backup.log 2>&1

# Option 3: Run twice daily (2 AM and 2 PM)
0 2,14 * * * /opt/db-backup/db-backup.sh >> /var/log/db-backup.log 2>&1

# Option 4: Run every 6 hours
0 */6 * * * /opt/db-backup/db-backup.sh >> /var/log/db-backup.log 2>&1
```

3. Save and exit (Ctrl+X, then Y, then Enter)

4. Verify cron job is scheduled:

```bash
sudo crontab -l
```

### 9. Monitor Backups

#### Check Recent Backups

```bash
# View log file
tail -f /var/log/db-backup.log

# List S3 backups
aws s3 ls s3://your-backup-bucket-name/backups/ --recursive --human-readable

# Check cron execution
grep CRON /var/log/syslog | grep db-backup
```

#### Set Up Alerts (Optional)

Create an SNS topic for backup notifications:

```bash
# Create SNS topic
aws sns create-topic --name db-backup-alerts

# Subscribe your email
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:YOUR_ACCOUNT_ID:db-backup-alerts \
    --protocol email \
    --notification-endpoint your-email@example.com

# Add SNS_TOPIC_ARN to .backup.env and uncomment the notification code in db-backup.sh
```

## Backup Features

- ✅ Automated daily PostgreSQL dumps
- ✅ Gzip compression to save storage space
- ✅ Uploads to S3 with timestamp
- ✅ Automatic cleanup of old backups (configurable retention)
- ✅ Comprehensive logging
- ✅ Error handling and validation
- ✅ Optional SNS notifications

## Restore from Backup

To restore a database from backup:

```bash
# Download backup from S3
aws s3 cp s3://your-backup-bucket-name/backups/db_backup_nca_lms_20260113_020000.sql.gz .

# Decompress
gunzip db_backup_nca_lms_20260113_020000.sql.gz

# Restore to database
PGPASSWORD=your_password psql -h localhost -U your_user -d your_database -f db_backup_nca_lms_20260113_020000.sql
```

## Troubleshooting

### Permission Errors

```bash
# Make sure script is executable
sudo chmod +x /opt/db-backup/db-backup.sh

# Check log file permissions
sudo chmod 644 /var/log/db-backup.log
```

### AWS Credentials Issues

```bash
# Test AWS credentials
aws s3 ls

# If using IAM role, verify it's attached
aws sts get-caller-identity
```

### PostgreSQL Connection Issues

```bash
# Test database connection
PGPASSWORD=your_password psql -h localhost -U your_user -d your_database -c "SELECT version();"

# Check if pg_dump is installed
which pg_dump
pg_dump --version
```

### Cron Not Running

```bash
# Check if cron service is running
sudo systemctl status cron

# Start cron service if needed
sudo systemctl start cron
sudo systemctl enable cron

# Check cron logs
grep CRON /var/log/syslog
```

## Security Best Practices

1. **Encrypt backups**: Enable S3 bucket encryption
2. **Restrict access**: Use IAM roles with minimal permissions
3. **Secure credentials**: Never commit `.backup.env` to version control
4. **Use VPC endpoints**: For EC2-to-S3 communication without internet
5. **Enable MFA delete**: Protect against accidental deletion
6. **Audit access**: Enable S3 access logging

## Cost Optimization

- Use S3 Lifecycle policies to move old backups to Glacier
- Adjust `RETENTION_DAYS` based on your needs
- Consider using S3 Intelligent-Tiering for automatic cost optimization

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [PostgreSQL pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Cron Job Tutorial](https://crontab.guru/)
