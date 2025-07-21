// src/pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
// import the admin client, **not** the browser one:
import { supabaseAdmin as supabase } from "@/lib/supabaseClient";

const ADMIN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("inserted_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // guard write operations with your admin token
  if (req.headers["x-admin-token"] !== ADMIN) {
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
