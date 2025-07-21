// src/pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Build a Supabase client with the *service* key, NOT the public anon key!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

const ADMIN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET /api/posts → fetch all
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("inserted_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // Protect POST & DELETE
  if (req.headers["x-admin-token"] !== ADMIN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // POST /api/posts → create
  if (req.method === "POST") {
    const { caption, media_url, type } = req.body;
    const { error } = await supabase
      .from("posts")
      .insert([{ caption, media_url, type }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).end();
  }

  // DELETE /api/posts → delete
  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).end();
  }

  res.setHeader("Allow", ["GET","POST","DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
