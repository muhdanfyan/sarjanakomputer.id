# Onyx - Open Source AI Platform

**Repo:** https://github.com/onyx-dot-app/onyx
**Stars:** 31k+ | **License:** MIT (CE) + Enterprise Edition

## Apa Itu Onyx?

Onyx adalah platform AI open-source self-hostable — alternatif dari Claude/ChatGPT yang bisa diinstal sendiri via Docker. Ranked **No. 1 di DeepResearch Bench** (Feb 2026), di atas semua pesaing proprietary.

## Fitur Unggulan

| Fitur | Keterangan |
|-------|-----------|
| **Agentic RAG** | Hybrid index + AI Agents untuk search & answer berkualitas |
| **Deep Research** | Multi-step research flow, No. 1 di leaderboard |
| **Custom Agents** | Bangun AI Agent dengan instruksi, knowledge, & actions unik |
| **Web Search** | Support Serper, Google PSE, Brave, SearXNG, web crawler bawaan |
| **Artifacts** | Generate dokumen, grafik, file download |
| **Actions & MCP** | Interaksi dengan aplikasi eksternal via MCP protocol |
| **Code Execution** | Eksekusi kode di sandbox (analisis data, render grafik) |
| **Voice Mode** | Text-to-speech & speech-to-text |
| **Image Generation** | Generate gambar dari prompt |

## LLM Support

Semua provider utama: Ollama, LiteLLM, vLLM (self-hosted) + Anthropic, OpenAI, Gemini (proprietary).

## Deployment

```
curl -fsSL https://onyx.app/install_onyx.sh | bash
```

Dua mode:
- **Lite** — Ringan (<1GB RAM), cocok untuk Chat UI + Agents
- **Standard** — Full fitur + RAG (vector index, Redis, MinIO, job queue)

Opsi lain: Docker, Kubernetes, Helm, Terraform.

## Lisensi

- **Community Edition (CE)** — MIT license, fitur core: Chat, RAG, Agents, Actions
- **Enterprise Edition (EE)** — Fitur tambahan: SSO, RBAC, Analytics, Whitelabeling

## Relevansi untuk CV Sarjana Komputer

Onyx bisa dimanfaatkan untuk:
1. **AI Chat internal perusahaan** — self-hosted, data aman di server sendiri
2. **Deep Research untuk E-Government** — riset kebijakan/laporan otomatis
3. **RAG untuk knowledge base** — dokumen peraturan, SOP, arsip proyek
4. **Custom Agent untuk klien** — solusi AI yang bisa di-deploy di VPS klien

---

*Sumber: https://github.com/onyx-dot-app/onyx | docs.onyx.app*
