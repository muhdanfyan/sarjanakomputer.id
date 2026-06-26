# Strategi Dapatkan ARM 24GB RAM di OCI Free Tier

## Status Saat Ini (25 Juni 2026)

### Akun OCI Aktif
- **Region:** ap-batam-1 (Batam, Indonesia — free tier)
- **Tenancy OCID:** `ocid1.tenancy.oc1..aaaaaaaarhpfsgdhbvludyjfsxmszpmhmgy2zg4kfjscqxfu7zb4vt36sznq`
- **User OCID:** `ocid1.user.oc1..aaaaaaaarhqoel2r7zqnpxvtx6h5bdd5ejgtnl5f7ylpmczh6hux5w2jivjq`
- **Fingerprint:** `23:e4:c6:f5:51:6b:de:1b:5a:3a:dd:c7:20:b2:af:56`
- **AD:** `JDgh:AP-BATAM-1-AD-1`
- **Subnet OCID:** `ocid1.subnet.oc1.ap-batam-1.aaaaaaaaoaljovw7prx64y7b5s5btf5utcm4ltzsbgj3p7s66rljq`
- **VCN OCID:** `ocid1.vcn.oc1.ap-batam-1.amaaaaaap3yi7vqaat2z36fptvb3o2ykmr2rxl7z4l4fosbpt5vq`

### Hasil Percobaan
| Spek | Hasil | Keterangan |
|------|-------|------------|
| 4 OCPU / 24GB / 200GB | ❌ 429 TooManyRequests | Rate limit kena |
| 3 OCPU / 18GB / 150GB | ❌ 400 LimitExceeded | Kuota 4 OCPU gratis UTUH tapi limit batasi |
| 2 OCPU / 12GB / 100GB | ❌ 500 Out of host capacity | Host capacity AD-1 penuh |

**Kesimpulan:** Akun ini BELUM punya instans ARM sama sekali. Kuota 4 OCPU / 24GB gratis UTUH. Tapi **host capacity di Batam habis total**. Bahkan 2 OCPU pun gagal.

---

## 3 Opsi Lanjutan

### Opsi 1: Cron Retry (Aktif)
Script retry tiap 60 menit via cron. Tunggu ada user lain terminate instans-nya.
- ✅ Gratis, zero effort
- ❌ Kemungkinan kecil — Batam zone masih baru, dikit yang pake
- Aktif sampai dapat atau sampai Bang decide ganti strategi

### Opsi 2: Akun OCI BARU — Region Lain ⭐ **REKOMENDASI**
Daftar akun OCI baru pake email berbeda + kartu kredit virtual.
- **Region alternatif (free tier):**
  - `ap-singapore-1` — Singapore (latency ~20ms dari Batam)
  - `ap-jakarta-1` — Jakarta (latency paling rendah)
  - `ca-montreal-1` — Montreal (capacity masih banyak)
  - `us-phoenix-1` — US West (capacity melimpah)
- **Butuh dari Bang:**
  1. Email baru (atau Google Account baru)
  2. Kartu kredit virtual (Jenius/Gotabby/Blu BCA) buat verifikasi

### Opsi 3: Provider Berbayar — Alternatif
| Provider | RAM | CPU | Harga/bulan | Catatan |
|----------|-----|-----|-------------|---------|
| Niagahoster KVM4 | 16GB | 4 vCPU | Rp213.900 | Hosting Indonesia, support cepat |
| Contabo VPS 30 | 24GB | 6 vCPU | Rp245.000 | Jerman, stabil |
| OCI Paid (byok) | 24GB | 4 OCPU | ~$30/bln | Same region Batam |

---

## SSH Credentials & Repositori Referensi

### Repositori Script OCI ARM Retry
Dipasang di `/home/pondokinformatika/oracle-freetier-instance-creation/`
1. **fut-hatas/oracle-freetier-instance-creation** — script utama retry (launch_arm.py)
2. **nathan-321/oracle-cloud-free-tier-setup** — setup OCI CLI
3. **joeonthecode/occ-fix.sh** — fix capacity issues
4. **Jman420/terraform-oci-arm-instance** — Terraform ARM deployment

### Script yang Ada
- `launch_arm.py` — retry create instance 4 OCPU 24GB (yg cron jalan)
- `coba_spek.py` — coba 3 variasi spek (2/3/4 OCPU)
- `oracle-freetier-instance-creation/` — clone dari repo-repo di atas

### Key SSH
- `~/.ssh/mpad.key` — key untuk instans mPAD (kalau nanti jadi)

---

## Catatan Buat Aiman

**Kalau nanti instans ARM jadi:** Aiman harus:
1. Catat IP public instans baru
2. SSH pake `mpad.key` user `ubuntu`
3. Install Docker + dependency
4. Deploy mPAD atau simpan bahan-bahan

**Kalau mau pindah strategi:** Bang Dadan perlu siapkan email + CC virtual buat daftar OCI baru.

---

*Dokumen ini disimpan di repo Sarjana sebagai referensi strategi OCI ARM*
