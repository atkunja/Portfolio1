// src/pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl       = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey= process.env.SUPABASE_SERVICE_KEY!;
const supabaseAdmin     = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Allow', ['GET','POST','PUT','DELETE']);
  // simple admin check
  if (req.method !== 'GET' && req.headers['x-admin-token'] !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .order('inserted_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  const { id, caption, media_url, type } = req.body;

  if (req.method === 'POST') {
    const { error } = await supabaseAdmin.from('posts').insert({ caption, media_url, type });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).end();
  }

  if (req.method === 'PUT') {
    const { error } = await supabaseAdmin
      .from('posts')
      .update({ caption, media_url, type })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).end();
  }

  res.status(405).end(`Method ${req.method} Not Allowed`);
}
