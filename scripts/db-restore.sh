#!/bin/bash

#######################################
# PostgreSQL Database Restore from S3
# This script downloads and restores a database backup from S3
#######################################

set -e

# Load environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.backup.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file not found at $ENV_FILE"
    exit 1
fi

source "$ENV_FILE"

# Validate required environment variables
required_vars=("DATABASE_URL" "S3_BUCKET_NAME" "AWS_REGION")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set in $ENV_FILE"
        exit 1
    fi
done

RESTORE_DIR="${RESTORE_DIR:-/tmp/db-restore}"
mkdir -p "$RESTORE_DIR"

# Parse DATABASE_URL
if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASSWORD="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo "Error: Invalid DATABASE_URL format"
    exit 1
fi

echo "============================================"
echo "Database Restore from S3"
echo "============================================"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo

# List available backups
echo "Available backups in S3:"
echo "-----------------------------------"
aws s3 ls "s3://${S3_BUCKET_NAME}/backups/" --region "$AWS_REGION" | grep "\.sql\.gz$" | nl

echo
echo "-----------------------------------"

# Get backup selection
if [ -n "$1" ]; then
    BACKUP_FILE="$1"
    echo "Using backup file from argument: $BACKUP_FILE"
else
    read -p "Enter the backup filename to restore: " BACKUP_FILE
fi

if [ -z "$BACKUP_FILE" ]; then
    echo "Error: No backup file specified"
    exit 1
fi

# Download from S3
S3_PATH="s3://${S3_BUCKET_NAME}/backups/${BACKUP_FILE}"
LOCAL_PATH="$RESTORE_DIR/$BACKUP_FILE"

echo
echo "Downloading backup from S3..."
if aws s3 cp "$S3_PATH" "$LOCAL_PATH" --region "$AWS_REGION"; then
    echo "Downloaded successfully ✓"
else
    echo "Error: Failed to download backup from S3"
    exit 1
fi

# Decompress
echo "Decompressing backup..."
DECOMPRESSED_FILE="${LOCAL_PATH%.gz}"
gunzip -c "$LOCAL_PATH" > "$DECOMPRESSED_FILE"
echo "Decompressed successfully ✓"

# Get file size
FILE_SIZE=$(du -h "$DECOMPRESSED_FILE" | cut -f1)
echo "Backup file size: $FILE_SIZE"

# Warning and confirmation
echo
echo "⚠️  WARNING: This will restore the database to the state of this backup."
echo "   Database: $DB_NAME"
echo "   Backup: $BACKUP_FILE"
echo
echo "   This operation will:"
echo "   1. Drop existing tables and data"
echo "   2. Restore from backup"
echo
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    rm -f "$LOCAL_PATH" "$DECOMPRESSED_FILE"
    exit 0
fi

# Create backup of current state (optional)
read -p "Create a backup of current database before restore? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    PRE_RESTORE_BACKUP="$RESTORE_DIR/pre_restore_backup_${TIMESTAMP}.sql"
    echo "Creating backup of current state..."
    export PGPASSWORD="$DB_PASSWORD"
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --no-owner --no-acl -f "$PRE_RESTORE_BACKUP"
    gzip "$PRE_RESTORE_BACKUP"
    echo "Current state backed up to: ${PRE_RESTORE_BACKUP}.gz ✓"
fi

# Restore database
echo
echo "Restoring database..."
export PGPASSWORD="$DB_PASSWORD"

if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$DECOMPRESSED_FILE"; then
    echo "Database restored successfully ✓"
else
    echo "Error: Database restore failed"
    unset PGPASSWORD
    exit 1
fi

unset PGPASSWORD

# Clean up
echo
read -p "Delete downloaded backup files? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f "$LOCAL_PATH" "$DECOMPRESSED_FILE"
    echo "Backup files cleaned up ✓"
else
    echo "Backup files kept in: $RESTORE_DIR"
fi

echo
echo "============================================"
echo "Restore Complete! ✓"
echo "============================================"
echo
echo "Next steps:"
echo "1. Verify database integrity"
echo "2. Test application functionality"
echo "3. Check for any missing data or errors"
echo
