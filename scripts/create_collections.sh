#!/bin/bash
# Script: Buat semua Collection PocketBase untuk Skomindo
# Target: http://103.126.117.20:8095

PB_URL="http://103.126.117.20:8095"
EMAIL="admin@sarjanakomputer.id"
PASS="Skomindo2026Admin"

echo "=== STEP 1: Login sebagai Superuser ==="
TOKEN=$(curl -s -X POST "$PB_URL/api/collections/_superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$EMAIL\",\"password\":\"$PASS\"}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "GAGAL LOGIN! Periksa kredensial."
  exit 1
fi
echo "Login berhasil! Token: ${TOKEN:0:20}..."

echo ""
echo "=== STEP 2: Membuat Collection 'news' ==="
curl -s -X POST "$PB_URL/api/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "news",
    "type": "base",
    "listRule": "",
    "viewRule": "",
    "fields": [
      {"name": "title", "type": "text", "required": true},
      {"name": "slug", "type": "text", "required": true},
      {"name": "date", "type": "date", "required": true},
      {"name": "category", "type": "text", "required": true},
      {"name": "image", "type": "file", "required": false, "options": {"maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpeg","image/png","image/webp","image/gif"]}},
      {"name": "description", "type": "text", "required": true},
      {"name": "content", "type": "editor", "required": false},
      {"name": "author", "type": "text", "required": true},
      {"name": "tags", "type": "json", "required": false}
    ]
  }' | python3 -m json.tool 2>/dev/null || echo "Response received"

echo ""
echo "=== STEP 3: Membuat Collection 'courses' ==="
curl -s -X POST "$PB_URL/api/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "courses",
    "type": "base",
    "listRule": "",
    "viewRule": "",
    "fields": [
      {"name": "title", "type": "text", "required": true},
      {"name": "slug", "type": "text", "required": true},
      {"name": "description", "type": "text", "required": true},
      {"name": "content", "type": "editor", "required": false},
      {"name": "price", "type": "number", "required": true},
      {"name": "image", "type": "file", "required": false, "options": {"maxSelect": 1, "maxSize": 5242880, "mimeTypes": ["image/jpeg","image/png","image/webp","image/gif"]}},
      {"name": "level", "type": "select", "required": true, "options": {"maxSelect": 1, "values": ["Beginner","Intermediate","Advanced"]}},
      {"name": "category", "type": "text", "required": true},
      {"name": "duration", "type": "text", "required": false}
    ]
  }' | python3 -m json.tool 2>/dev/null || echo "Response received"

echo ""
echo "=== STEP 4: Membuat Collection 'classes' ==="
curl -s -X POST "$PB_URL/api/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "classes",
    "type": "base",
    "listRule": "",
    "viewRule": "",
    "fields": [
      {"name": "name", "type": "text", "required": true},
      {"name": "slug", "type": "text", "required": true},
      {"name": "course", "type": "text", "required": true},
      {"name": "mentor", "type": "text", "required": true},
      {"name": "startDate", "type": "date", "required": true},
      {"name": "status", "type": "select", "required": true, "options": {"maxSelect": 1, "values": ["Open","Closed","Ongoing"]}},
      {"name": "capacity", "type": "number", "required": false}
    ]
  }' | python3 -m json.tool 2>/dev/null || echo "Response received"

echo ""
echo "=== STEP 5: Membuat Collection 'profiles' ==="
curl -s -X POST "$PB_URL/api/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "profiles",
    "type": "base",
    "listRule": "",
    "viewRule": "",
    "fields": [
      {"name": "title", "type": "text", "required": false},
      {"name": "companyName", "type": "text", "required": true},
      {"name": "heroSubtitle", "type": "text", "required": false},
      {"name": "namaResmi", "type": "text", "required": false},
      {"name": "bidangUsaha", "type": "text", "required": false},
      {"name": "didirikan", "type": "text", "required": false},
      {"name": "skKemenkumham", "type": "text", "required": false},
      {"name": "nib", "type": "text", "required": false},
      {"name": "npwp", "type": "text", "required": false},
      {"name": "lokasi", "type": "text", "required": false},
      {"name": "pendiri", "type": "text", "required": false},
      {"name": "jumlahPersonil", "type": "text", "required": false},
      {"name": "visi", "type": "text", "required": false},
      {"name": "misi", "type": "json", "required": false},
      {"name": "tim", "type": "json", "required": false},
      {"name": "kbli", "type": "json", "required": false},
      {"name": "alamat", "type": "text", "required": false},
      {"name": "email_address", "type": "email", "required": false},
      {"name": "whatsapp", "type": "text", "required": false},
      {"name": "whatsapp_link", "type": "url", "required": false},
      {"name": "address", "type": "text", "required": false},
      {"name": "phone", "type": "text", "required": false},
      {"name": "socialMedia", "type": "json", "required": false}
    ]
  }' | python3 -m json.tool 2>/dev/null || echo "Response received"

echo ""
echo "========================================="
echo "  SEMUA COLLECTION BERHASIL DIBUAT!"
echo "========================================="
