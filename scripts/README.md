# Database Backup Scripts

Automated PostgreSQL database backup system with AWS S3 integration and daily cron job scheduling.

## Quick Start

### 1. On Your Ubuntu Server

```bash
# Upload scripts to your server
scp -r scripts/ ubuntu@your-server-ip:/home/ubuntu/

# SSH into your server
ssh ubuntu@your-server-ip

# Run the installation script
cd /home/ubuntu/scripts
chmod +x install-backup.sh
./install-backup.sh
```

### 2. Configure Environment

Edit the configuration file:

```bash
sudo nano /opt/db-backup/.backup.env
```

Required settings:
- `DATABASE_URL`: Your PostgreSQL connection string
- `S3_BUCKET_NAME`: Your S3 bucket name
- `AWS_REGION`: AWS region (e.g., us-east-1)

### 3. Test Backup

```bash
sudo /opt/db-backup/db-backup.sh
```

### 4. Verify

```bash
# Check logs
tail -f /var/log/db-backup.log

# List S3 backups
aws s3 ls s3://your-bucket-name/backups/
```

## Files Overview

| File | Description |
|------|-------------|
| `db-backup.sh` | Main backup script - dumps DB and uploads to S3 |
| `db-restore.sh` | Restore script - downloads and restores from S3 |
| `install-backup.sh` | Automated installation and setup script |
| `.backup.env.example` | Environment configuration template |
| `BACKUP_SETUP.md` | Complete setup documentation |

## Features

- ✅ Automated daily PostgreSQL backups
- ✅ Gzip compression
- ✅ AWS S3 storage with encryption
- ✅ Configurable retention policy (default: 7 days)
- ✅ Comprehensive logging
- ✅ Error handling and validation
- ✅ Easy restoration process
- ✅ Optional SNS notifications

## Cron Schedule Examples

```bash
# Daily at 2 AM
0 2 * * * /opt/db-backup/db-backup.sh >> /var/log/db-backup.log 2>&1

# Twice daily (2 AM and 2 PM)
0 2,14 * * * /opt/db-backup/db-backup.sh >> /var/log/db-backup.log 2>&1

# Every 6 hours
0 */6 * * * /opt/db-backup/db-backup.sh >> /var/log/db-backup.log 2>&1
```

## Restore a Backup

```bash
# Make script executable
chmod +x /opt/db-backup/db-restore.sh

# Run restore (interactive)
/opt/db-backup/db-restore.sh

# Or specify backup file directly
/opt/db-backup/db-restore.sh db_backup_nca_lms_20260113_020000.sql.gz
```

## Monitoring

### View Logs

```bash
# Real-time logs
tail -f /var/log/db-backup.log

# Last 50 lines
tail -50 /var/log/db-backup.log

# Search for errors
grep -i error /var/log/db-backup.log
```

### Check Backups

```bash
# List all backups with dates
aws s3 ls s3://your-bucket-name/backups/ --recursive --human-readable

# Download a specific backup
aws s3 cp s3://your-bucket-name/backups/db_backup_xxx.sql.gz .
```

### Verify Cron

```bash
# List cron jobs
sudo crontab -l

# Check cron execution logs
grep CRON /var/log/syslog | grep db-backup
```

## Troubleshooting

### Common Issues

1. **Permission denied**
   ```bash
   sudo chmod +x /opt/db-backup/db-backup.sh
   ```

2. **AWS credentials error**
   ```bash
   aws configure
   # Or attach IAM role to EC2 instance
   ```

3. **PostgreSQL connection failed**
   ```bash
   # Test connection
   psql -h your-host -U your-user -d your-database
   ```

4. **Cron not running**
   ```bash
   sudo systemctl status cron
   sudo systemctl start cron
   ```

## Security Notes

- Never commit `.backup.env` to version control (it's in `.gitignore`)
- Use IAM roles instead of access keys when possible
- Enable S3 bucket encryption
- Restrict IAM permissions to minimum required
- Regularly rotate AWS credentials
- Enable MFA for AWS account

## Cost Optimization

- Adjust `RETENTION_DAYS` based on your needs
- Use S3 Lifecycle policies to move old backups to Glacier
- Consider S3 Intelligent-Tiering for automatic cost savings
- Monitor S3 storage costs in AWS Cost Explorer

## Documentation

For complete setup instructions and advanced configuration, see:
- [BACKUP_SETUP.md](./BACKUP_SETUP.md) - Detailed setup guide

## Support

If you encounter issues:
1. Check the log file: `/var/log/db-backup.log`
2. Verify environment configuration
3. Test AWS connectivity: `aws s3 ls`
4. Test database connection: `psql` with your credentials

## License

This backup system is part of the NCA LMS project.
