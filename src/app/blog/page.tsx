"use client";
export const dynamic = "force-dynamic";

import { Fragment, useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;

type Post = {
  id: number;
  caption: string;
  media_url: string | null;
  type: "text" | "image" | "video";
  inserted_at: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editMediaUrl, setEditMediaUrl] = useState<string | null>(null);
  const [editMediaType, setEditMediaType] = useState<"text" | "image" | "video">("text");

  const [lightbox, setLightbox] = useState<Post | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const loadPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_TOKEN) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
    } else {
      alert("Wrong password");
    }
  };

  const handleSubmit = async () => {
    let url: string | null = editId ? editMediaUrl : null;
    let type: Post["type"] = editId ? editMediaType : "text";

    if (media) {
      const filePath = `${Date.now()}_${media.name}`;
      const { error: upErr } = await supabase
        .storage.from("blog-media")
        .upload(filePath, media);

      if (upErr) {
        alert("Upload error: " + upErr.message); // <-- Error message for debugging
        return;
      }

      const { data } = await supabase.storage.from("blog-media").getPublicUrl(filePath);

      url = data.publicUrl;
      type = media.type.startsWith("video") ? "video" : "image";
    }

    const body = { id: editId, caption, media_url: url, type };
    const method = editId ? "PUT" : "POST";

    await fetch("/api/posts", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": ADMIN_TOKEN,
      },
      body: JSON.stringify(body),
    });

    setCaption("");
    setMedia(null);
    setEditId(null);
    setEditMediaUrl(null);
    setEditMediaType("text");
    loadPosts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": ADMIN_TOKEN,
      },
      body: JSON.stringify({ id }),
    });
    loadPosts();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-base text-ink">
      <div className="warm-glow" aria-hidden />
      <div className="paper-grain" aria-hidden />

      {/* NAVIGATION BACK TO HOME */}
      <nav className="absolute top-4 right-4 z-50">
        <Link
          href="/"
          className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-ink-muted shadow transition hover:border-honey/60 hover:text-honey"
        >
          ← back home
        </Link>
      </nav>

      {/* Admin Login / Logout */}
      {isAdmin ? (
        <button
          onClick={() => setIsAdmin(false)}
          className="absolute top-4 left-4 rounded-full bg-rust px-3 py-1.5 text-sm text-bg-base"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          className="absolute top-4 left-4 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-honey transition hover:text-honey-soft"
        >
          Admin Login
        </button>
      )}

      {/* Login Modal */}
      <Transition show={showLogin} as={Fragment}>
        <Dialog
          onClose={() => setShowLogin(false)}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-bg-base/70" aria-hidden="true" />
          <div className="warm-card relative w-full max-w-sm p-6">
            <Dialog.Title className="mb-4 font-display text-xl font-semibold text-ink">
              Enter Admin Password
            </Dialog.Title>
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-3 text-2xl text-ink-faint hover:text-ink"
            >
              &times;
            </button>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-4 w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-ink outline-none transition focus:border-honey"
            />
            <button
              onClick={handleLogin}
              className="warm-button w-full py-2"
            >
              Login
            </button>
          </div>
        </Dialog>
      </Transition>

      <section className="mx-auto max-w-3xl px-4 pt-24 pb-10">
        {/* Title */}
        <h1 className="mb-10 text-center font-display text-5xl font-semibold text-ink">
          my blog
        </h1>

        {/* Post Form (admin only) */}
        {isAdmin && (
          <div className="warm-card mb-10 p-6">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMedia(e.target.files?.[0] || null)
              }
              className="mb-3 block w-full text-sm text-ink-muted"
            />

            {/* Show current media when editing */}
            {editMediaUrl && (
              <div className="mb-2">
                {editMediaType === "image" ? (
                  <Image src={editMediaUrl} alt="Current media" width={250} height={180} className="rounded mb-2" />
                ) : editMediaType === "video" ? (
                  <video src={editMediaUrl} controls className="rounded mb-2 max-w-xs max-h-48" />
                ) : null}
                <button
                  onClick={() => { setEditMediaUrl(null); setEditMediaType("text"); }}
                  className="ml-2 text-xs text-rust underline"
                  type="button"
                >
                  Remove Media
                </button>
              </div>
            )}

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your post here..."
              className="mb-4 h-24 w-full resize-none rounded-lg border border-border bg-surface-2 p-2 text-ink outline-none transition focus:border-honey"
            />
            <button
              onClick={handleSubmit}
              className="warm-button px-5 py-2"
            >
              {editId != null ? "Update Post" : "Post"}
            </button>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-8">
          {posts.map((p) => (
            <article
              key={p.id}
              className="warm-card p-4"
            >
              <div className="mb-2 flex items-center justify-between text-sm text-ink-faint">
                <span className="font-hand text-base">🗓️ {formatDate(p.inserted_at)}</span>
                {isAdmin && (
                  <span>
                    <button
                      onClick={() => {
                        setEditId(p.id);
                        setCaption(p.caption);
                        setEditMediaUrl(p.media_url);
                        setEditMediaType(p.type);
                      }}
                      className="mr-2 text-sm text-honey hover:text-honey-soft"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-sm text-rust hover:underline"
                    >
                      Delete
                    </button>
                  </span>
                )}
              </div>

              {p.type === "image" && p.media_url && (
                <Image
                  src={p.media_url}
                  alt={p.caption || ""}
                  width={800}
                  height={600}
                  className="mb-3 w-full max-h-64 object-cover rounded-md cursor-pointer"
                  onClick={() => setLightbox(p)}
                />
              )}

              {p.type === "video" && p.media_url && (
                <video
                  src={p.media_url}
                  controls
                  className="mb-3 w-full max-h-64 rounded-md cursor-pointer"
                  onClick={() => setLightbox(p)}
                />
              )}

              {p.type === "text" && <p className="leading-relaxed text-ink-muted">{p.caption}</p>}
            </article>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <Transition show={!!lightbox} as={Fragment}>
        <Dialog
          onClose={() => setLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-bg-base/85" aria-hidden="true" />
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-2xl text-ink"
            >
              &times;
            </button>

            {lightbox?.type === "image" && lightbox.media_url && (
              <Image
                src={lightbox.media_url}
                alt={lightbox.caption || ""}
                width={800}
                height={600}
                style={{ objectFit: "contain" }}
                className="max-h-screen max-w-screen"
              />
            )}
            {lightbox?.type === "video" && lightbox.media_url && (
              <video
                src={lightbox.media_url}
                controls
                autoPlay
                className="max-h-screen max-w-screen"
              />
            )}
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
