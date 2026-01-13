#!/bin/bash

#######################################
# Automated Backup Setup Script
# This script installs and configures the database backup system
#######################################

set -e

echo "============================================"
echo "Database Backup System - Installation"
echo "============================================"
echo

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "Please run this script as a regular user with sudo privileges, not as root."
    exit 1
fi

# Check for sudo privileges
if ! sudo -v; then
    echo "Error: This script requires sudo privileges"
    exit 1
fi

# Configuration
BACKUP_DIR="/opt/db-backup"
SCRIPT_NAME="db-backup.sh"
LOG_FILE="/var/log/db-backup.log"

echo "Step 1: Installing dependencies..."
echo "-----------------------------------"

# Update package list
sudo apt update

# Install PostgreSQL client if not installed
if ! command -v pg_dump &> /dev/null; then
    echo "Installing PostgreSQL client..."
    sudo apt install -y postgresql-client
else
    echo "PostgreSQL client already installed ✓"
fi

# Check for AWS CLI
if ! command -v aws &> /dev/null; then
    echo "AWS CLI not found. Installing..."
    read -p "Install AWS CLI v2? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd /tmp
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip -q awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
        echo "AWS CLI installed ✓"
    else
        echo "Installing AWS CLI v1 from apt..."
        sudo apt install -y awscli
    fi
else
    echo "AWS CLI already installed ✓"
    aws --version
fi

echo
echo "Step 2: Creating backup directory structure..."
echo "-----------------------------------------------"

# Create backup directory
sudo mkdir -p "$BACKUP_DIR"
echo "Created directory: $BACKUP_DIR ✓"

# Create log file
sudo touch "$LOG_FILE"
sudo chmod 644 "$LOG_FILE"
sudo chown $USER:$USER "$LOG_FILE"
echo "Created log file: $LOG_FILE ✓"

echo
echo "Step 3: Copying backup script..."
echo "----------------------------------"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Copy backup script
if [ -f "$SCRIPT_DIR/$SCRIPT_NAME" ]; then
    sudo cp "$SCRIPT_DIR/$SCRIPT_NAME" "$BACKUP_DIR/"
    sudo chmod +x "$BACKUP_DIR/$SCRIPT_NAME"
    echo "Backup script installed to $BACKUP_DIR/$SCRIPT_NAME ✓"
else
    echo "Error: Backup script not found at $SCRIPT_DIR/$SCRIPT_NAME"
    exit 1
fi

echo
echo "Step 4: Setting up environment configuration..."
echo "------------------------------------------------"

# Copy environment template
if [ -f "$SCRIPT_DIR/.backup.env.example" ]; then
    if [ ! -f "$BACKUP_DIR/.backup.env" ]; then
        sudo cp "$SCRIPT_DIR/.backup.env.example" "$BACKUP_DIR/.backup.env"
        sudo chmod 600 "$BACKUP_DIR/.backup.env"
        echo "Environment template copied to $BACKUP_DIR/.backup.env"
        echo "⚠️  IMPORTANT: You must edit this file with your actual configuration!"
    else
        echo "Environment file already exists at $BACKUP_DIR/.backup.env ✓"
    fi
else
    echo "Warning: .backup.env.example not found. Creating basic template..."
    sudo tee "$BACKUP_DIR/.backup.env" > /dev/null <<EOF
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
S3_BUCKET_NAME=your-backup-bucket-name
AWS_REGION=us-east-1
BACKUP_DIR=/tmp/db-backups
RETENTION_DAYS=7
LOG_FILE=/var/log/db-backup.log
EOF
    sudo chmod 600 "$BACKUP_DIR/.backup.env"
    echo "Created basic environment template at $BACKUP_DIR/.backup.env"
    echo "⚠️  IMPORTANT: You must edit this file with your actual configuration!"
fi

echo
echo "Step 5: Configuring AWS credentials (optional)..."
echo "---------------------------------------------------"

read -p "Do you want to configure AWS credentials now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v aws &> /dev/null; then
        aws configure
    else
        echo "AWS CLI not available. Skipping credential configuration."
    fi
else
    echo "Skipped AWS credential configuration."
    echo "Note: If using IAM role, make sure it's attached to your EC2 instance."
fi

echo
echo "Step 6: Testing backup script..."
echo "----------------------------------"

read -p "Do you want to edit the environment file now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo "${EDITOR:-nano}" "$BACKUP_DIR/.backup.env"
fi

read -p "Do you want to run a test backup now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running test backup..."
    sudo "$BACKUP_DIR/$SCRIPT_NAME"
    echo
    echo "Check the log file for results:"
    echo "  tail -20 $LOG_FILE"
else
    echo "Skipped test backup."
fi

echo
echo "Step 7: Setting up cron job..."
echo "-------------------------------"

read -p "Do you want to set up the cron job now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo
    echo "Select backup schedule:"
    echo "1) Daily at 2:00 AM (recommended)"
    echo "2) Daily at 3:00 AM"
    echo "3) Twice daily (2 AM and 2 PM)"
    echo "4) Every 6 hours"
    echo "5) Custom (manual entry)"
    echo
    read -p "Enter choice (1-5): " -n 1 -r schedule_choice
    echo

    case $schedule_choice in
        1)
            CRON_SCHEDULE="0 2 * * *"
            CRON_DESC="Daily at 2:00 AM"
            ;;
        2)
            CRON_SCHEDULE="0 3 * * *"
            CRON_DESC="Daily at 3:00 AM"
            ;;
        3)
            CRON_SCHEDULE="0 2,14 * * *"
            CRON_DESC="Twice daily at 2 AM and 2 PM"
            ;;
        4)
            CRON_SCHEDULE="0 */6 * * *"
            CRON_DESC="Every 6 hours"
            ;;
        5)
            read -p "Enter custom cron schedule: " CRON_SCHEDULE
            CRON_DESC="Custom schedule"
            ;;
        *)
            echo "Invalid choice. Skipping cron setup."
            CRON_SCHEDULE=""
            ;;
    esac

    if [ -n "$CRON_SCHEDULE" ]; then
        CRON_JOB="$CRON_SCHEDULE $BACKUP_DIR/$SCRIPT_NAME >> $LOG_FILE 2>&1"

        # Check if cron job already exists
        if sudo crontab -l 2>/dev/null | grep -q "$BACKUP_DIR/$SCRIPT_NAME"; then
            echo "Cron job already exists. Skipping."
        else
            # Add cron job
            (sudo crontab -l 2>/dev/null; echo "$CRON_JOB") | sudo crontab -
            echo "Cron job added: $CRON_DESC ✓"
            echo "Schedule: $CRON_SCHEDULE"
        fi

        echo
        echo "View current crontab:"
        sudo crontab -l
    fi
else
    echo "Skipped cron setup. You can set it up later manually."
fi

echo
echo "============================================"
echo "Installation Complete! ✓"
echo "============================================"
echo
echo "Next Steps:"
echo "1. Edit environment file:"
echo "   sudo nano $BACKUP_DIR/.backup.env"
echo
echo "2. Create S3 bucket (if not exists):"
echo "   aws s3 mb s3://your-backup-bucket-name"
echo
echo "3. Test the backup:"
echo "   sudo $BACKUP_DIR/$SCRIPT_NAME"
echo
echo "4. Check the logs:"
echo "   tail -f $LOG_FILE"
echo
echo "5. Verify cron job:"
echo "   sudo crontab -l"
echo
echo "For more information, see scripts/BACKUP_SETUP.md"
echo "============================================"
