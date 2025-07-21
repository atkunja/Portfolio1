// src/pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseClient";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: list
  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("inserted_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // Protect write endpoints
  if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // POST: create
  if (req.method === "POST") {
    const { caption, media_url, type } = req.body;
    const { error } = await supabaseAdmin
      .from("posts")
      .insert([{ caption, media_url, type }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).end();
  }

  // DELETE
  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).end();
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
