import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { path, content, message } = await request.json();
    
    if (!path || !content || !message) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Asumsi environment variable di .env: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO
    const token = import.meta.env.GITHUB_TOKEN;
    const owner = import.meta.env.GITHUB_OWNER || 'muhdanfyan';
    const repo = import.meta.env.GITHUB_REPO || 'sarjanakomputer.id';
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'GitHub token is missing in environment' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Cek file apakah sudah ada untuk mendapatkan SHA-nya (dibutuhkan untuk update file)
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    let sha = undefined;
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // Lakukan Commit dengan base64 encoded content
    const commitData = {
      message: message,
      content: Buffer.from(content).toString('base64'),
      ...(sha && { sha })
    };

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commitData)
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      return new Response(JSON.stringify({ error: errorData.message || 'Failed to commit' }), { 
        status: putRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'File committed successfully to GitHub' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
