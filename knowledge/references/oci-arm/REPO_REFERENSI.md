# OCI ARM Instance Creation — Referensi Repo

## Repo Reference untuk OCI Free Tier ARM

| Repo | URL | Fungsi | Status |
|------|-----|--------|--------|
| **oracle-freetier-instance-creation** | https://github.com/mohankumarpaluru/oracle-freetier-instance-creation | Script utama retry ARM (sdh dipake) | ✅ Udah di VPS |
| **futchas/oracle-cloud-free-arm-instance** | https://github.com/futchas/oracle-cloud-free-arm-instance | Alternatif retry, multi-region | 📥 Perlu review |
| **mosesman831/OCI-OcC-Fix** | https://github.com/mosesman831/OCI-OcC-Fix | Fix limit/out-of-capacity | 📥 Perlu review |
| **gardinbe/oracle-compute-instance-creation-script** | https://github.com/gardinbe/oracle-compute-instance-creation-script | Script creation alternatif | 📥 Perlu review |

## Lokal VPS
- Path: /home/pondokinformatika/oracle-freetier-instance-creation/
- Config: oci_config, oci.env
- Script utama: launch_arm.py
- Status: LimitExceeded di ap-batam-1
- Cron: oci-arm-retry tiap 60 menit
