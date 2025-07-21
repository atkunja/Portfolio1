// src/pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET /api/posts → list
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("inserted_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST /api/posts → create or update
  if (req.method === "POST") {
    const { id, caption, mediaURL, type, edit } = req.body;
    // simple admin check
    if (req.headers["x-admin-token"] !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (edit) {
      // update
      const { error } = await supabase
        .from("posts")
        .update({ caption, media_url: mediaURL, type })
        .eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).end();
    } else {
      // insert
      const { error } = await supabase
        .from("posts")
        .insert({ id, caption, media_url: mediaURL, type });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).end();
    }
  }

  // DELETE /api/posts → delete
  if (req.method === "DELETE") {
    const { id } = req.body;
    if (req.headers["x-admin-token"] !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).end();
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
