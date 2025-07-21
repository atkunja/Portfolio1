// src/pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

  // ─── GET /api/posts ───────────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("inserted_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);
      return res.status(500).json({ error: error.message });
    }
    // send back just the array of posts
    return res.status(200).json(data);
  }

  // ─── Admin check for write operations ────────────────────────────────────────
  if (!ADMIN_TOKEN || req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ─── POST /api/posts ──────────────────────────────────────────────────────────
  if (req.method === "POST") {
    const { caption, media_url, type } = req.body as {
      caption: string;
      media_url: string | null;
      type: "text" | "image" | "video";
    };
    const { error } = await supabase
      .from("posts")
      .insert([{ caption, media_url, type }]);

    if (error) {
      console.error("Supabase INSERT error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).end();
  }

  // ─── PUT /api/posts ───────────────────────────────────────────────────────────
  if (req.method === "PUT") {
    const { id, caption, media_url, type } = req.body as {
      id: number;
      caption: string;
      media_url: string | null;
      type: "text" | "image" | "video";
    };
    const { error } = await supabase
      .from("posts")
      .update({ caption, media_url, type })
      .eq("id", id);

    if (error) {
      console.error("Supabase UPDATE error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).end();
  }

  // ─── DELETE /api/posts ────────────────────────────────────────────────────────
  if (req.method === "DELETE") {
    const { id } = req.body as { id: number };
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase DELETE error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).end();
  }

  // ─── Method not allowed ───────────────────────────────────────────────────────
  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
