#!/bin/bash
# ============================================================
# Ujenzi Dhabiti — Automated Database Backup
# Runs daily via cron (/etc/cron.daily/ujenzi-backup)
# Backs up PostgreSQL → compressed file → uploads to B2/Spaces
# Keeps last 30 days, deletes older backups automatically
# ============================================================

set -e

# ─── Config ───────────────────────────────────────────────────
DB_NAME="ujenzidhabiti"
DB_USER="ujenziapp"
BACKUP_DIR="/var/backups/ujenzi-dhabiti"
RETENTION_DAYS=30
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="db_backup_${DATE}.sql.gz"
FILEPATH="${BACKUP_DIR}/${FILENAME}"

# Load env (contains storage credentials)
source /var/www/ujenzi-dhabiti/.env.production

# ─── Storage config ───────────────────────────────────────────
# Option A: Backblaze B2 (S3-compatible, cheapest)
# Set these in .env.production:
#   BACKUP_S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
#   BACKUP_S3_BUCKET=ujenzi-dhabiti-backups
#   AWS_ACCESS_KEY_ID=your_b2_key_id
#   AWS_SECRET_ACCESS_KEY=your_b2_app_key
#
# Option B: DigitalOcean Spaces (if your VPS is on DO)
#   BACKUP_S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
#   BACKUP_S3_BUCKET=ujenzi-dhabiti-backups
#   AWS_ACCESS_KEY_ID=your_spaces_key
#   AWS_SECRET_ACCESS_KEY=your_spaces_secret

mkdir -p "$BACKUP_DIR"

# ─── Create backup ────────────────────────────────────────────
echo "[$(date)] Starting backup: $FILENAME"

pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$FILEPATH"

SIZE=$(du -sh "$FILEPATH" | cut -f1)
echo "[$(date)] Backup created: $FILEPATH ($SIZE)"

# ─── Upload to cloud storage ──────────────────────────────────
if [ -n "$BACKUP_S3_BUCKET" ] && [ -n "$BACKUP_S3_ENDPOINT" ]; then
    echo "[$(date)] Uploading to cloud storage..."
    aws s3 cp "$FILEPATH" \
        "s3://${BACKUP_S3_BUCKET}/daily/${FILENAME}" \
        --endpoint-url "$BACKUP_S3_ENDPOINT" \
        --storage-class STANDARD
    echo "[$(date)] Upload complete: s3://${BACKUP_S3_BUCKET}/daily/${FILENAME}"
else
    echo "[$(date)] WARNING: No cloud storage configured. Backup kept locally only."
    echo "          Set BACKUP_S3_BUCKET and BACKUP_S3_ENDPOINT in .env.production"
fi

# ─── Delete local backups older than retention period ─────────
echo "[$(date)] Cleaning up backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# ─── Delete remote backups older than retention period ────────
if [ -n "$BACKUP_S3_BUCKET" ] && [ -n "$BACKUP_S3_ENDPOINT" ]; then
    CUTOFF_DATE=$(date -d "${RETENTION_DAYS} days ago" +%Y-%m-%d)
    aws s3 ls "s3://${BACKUP_S3_BUCKET}/daily/" \
        --endpoint-url "$BACKUP_S3_ENDPOINT" \
        | awk '{print $4}' \
        | while read -r fname; do
            FILE_DATE=$(echo "$fname" | grep -oP '\d{4}-\d{2}-\d{2}')
            if [[ "$FILE_DATE" < "$CUTOFF_DATE" ]]; then
                aws s3 rm "s3://${BACKUP_S3_BUCKET}/daily/${fname}" \
                    --endpoint-url "$BACKUP_S3_ENDPOINT"
                echo "[$(date)] Deleted old backup: $fname"
            fi
        done
fi

echo "[$(date)] Backup finished successfully."
