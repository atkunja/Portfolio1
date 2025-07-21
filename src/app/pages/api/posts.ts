// src/pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("inserted_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // all others require admin token
  if (!ADMIN_TOKEN || req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { caption, media_url, type } = req.body;
    const { error } = await supabase
      .from("posts")
      .insert([{ caption, media_url, type }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).end();
  }

  if (req.method === "PUT") {
    const { id, caption, media_url, type } = req.body;
    const { error } = await supabase
      .from("posts")
      .update({ caption, media_url, type })
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).end();
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).end();
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
