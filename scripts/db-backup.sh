#!/bin/bash

#######################################
# PostgreSQL Database Backup to S3
# This script creates a database dump and uploads it to AWS S3
#######################################

# Exit on any error
set -e

# Load environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.backup.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file not found at $ENV_FILE"
    echo "Please create .backup.env with required variables"
    exit 1
fi

# Source environment variables
source "$ENV_FILE"

# Validate required environment variables
required_vars=("DATABASE_URL" "S3_BUCKET_NAME" "AWS_REGION")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set in $ENV_FILE"
        exit 1
    fi
done

# Set defaults
BACKUP_DIR="${BACKUP_DIR:-/tmp/db-backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
LOG_FILE="${LOG_FILE:-/var/log/db-backup.log}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "============================================"
log "Starting database backup process"

# Parse DATABASE_URL to extract connection details
# Format: postgresql://user:password@host:port/database
if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASSWORD="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    log "Error: Invalid DATABASE_URL format"
    exit 1
fi

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="db_backup_${DB_NAME}_${TIMESTAMP}.sql"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILENAME"
COMPRESSED_FILENAME="${BACKUP_FILENAME}.gz"
COMPRESSED_PATH="$BACKUP_DIR/$COMPRESSED_FILENAME"

log "Database: $DB_NAME"
log "Backup file: $COMPRESSED_FILENAME"

# Create database dump
log "Creating database dump..."
export PGPASSWORD="$DB_PASSWORD"

if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --no-owner --no-acl --clean --if-exists \
    -f "$BACKUP_PATH"; then
    log "Database dump created successfully"
else
    log "Error: Database dump failed"
    exit 1
fi

# Unset password from environment
unset PGPASSWORD

# Compress the backup
log "Compressing backup..."
if gzip "$BACKUP_PATH"; then
    log "Backup compressed successfully"
else
    log "Error: Compression failed"
    exit 1
fi

# Get file size
FILE_SIZE=$(du -h "$COMPRESSED_PATH" | cut -f1)
log "Compressed file size: $FILE_SIZE"

# Upload to S3
log "Uploading to S3..."
S3_PATH="s3://${S3_BUCKET_NAME}/backups/${COMPRESSED_FILENAME}"

if aws s3 cp "$COMPRESSED_PATH" "$S3_PATH" --region "$AWS_REGION"; then
    log "Backup uploaded to S3: $S3_PATH"
else
    log "Error: S3 upload failed"
    exit 1
fi

# Clean up local backup file
log "Cleaning up local backup file..."
rm -f "$COMPRESSED_PATH"
log "Local backup file removed"

# Remove old backups from S3 (older than RETENTION_DAYS)
log "Cleaning up old S3 backups (older than ${RETENTION_DAYS} days)..."
CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y-%m-%d 2>/dev/null || date -v-${RETENTION_DAYS}d +%Y-%m-%d)

aws s3 ls "s3://${S3_BUCKET_NAME}/backups/" --region "$AWS_REGION" | while read -r line; do
    # Parse the file date and name
    FILE_DATE=$(echo "$line" | awk '{print $1}')
    FILE_NAME=$(echo "$line" | awk '{print $4}')

    if [ -n "$FILE_NAME" ] && [ "$FILE_DATE" \< "$CUTOFF_DATE" ]; then
        log "Deleting old backup: $FILE_NAME (from $FILE_DATE)"
        aws s3 rm "s3://${S3_BUCKET_NAME}/backups/${FILE_NAME}" --region "$AWS_REGION"
    fi
done

log "Backup process completed successfully"
log "============================================"

# Send notification (optional - uncomment if you want email notifications)
# You can integrate with SNS or SES for notifications
# if [ -n "$SNS_TOPIC_ARN" ]; then
#     aws sns publish \
#         --topic-arn "$SNS_TOPIC_ARN" \
#         --subject "Database Backup Successful - $DB_NAME" \
#         --message "Backup completed at $(date). File: $COMPRESSED_FILENAME, Size: $FILE_SIZE" \
#         --region "$AWS_REGION"
# fi

exit 0
