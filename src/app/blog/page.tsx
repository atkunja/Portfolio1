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
    <div className="relative min-h-screen bg-[#0A0C12] text-white">

      {/* NAVIGATION BACK TO HOME */}
      <nav className="absolute top-4 right-4 z-50">
        <Link
          href="/"
          className="bg-gray-800 hover:bg-cyan-600 text-white px-3 py-1 rounded text-sm shadow transition"
        >
          ← Back to Home
        </Link>
      </nav>

      {/* Admin Login / Logout */}
      {isAdmin ? (
        <button
          onClick={() => setIsAdmin(false)}
          className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded text-sm"
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
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <Dialog.Title className="mb-4 text-xl font-semibold">
              Enter Admin Password
            </Dialog.Title>
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-4 px-3 py-2 bg-gray-800 rounded outline-none"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 py-2 rounded"
            >
              Login
            </button>
          </div>
        </Dialog>
      </Transition>

      <section className="mx-auto max-w-3xl px-4 pt-24 pb-10">
        {/* Animated Title */}
        <h1 className="text-5xl font-extrabold text-cyan-400 text-center mb-10 animate-fade-in">
          My Blog
        </h1>

        {/* Post Form (admin only) */}
        {isAdmin && (
          <div className="mb-10 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMedia(e.target.files?.[0] || null)
              }
              className="mb-3 block w-full text-sm text-white"
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
                  className="ml-2 text-red-400 underline text-xs"
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
              className="w-full mb-4 h-24 p-2 bg-gray-800 rounded resize-none outline-none"
            />
            <button
              onClick={handleSubmit}
              className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded"
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
              className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800"
            >
              <div className="flex justify-between items-center mb-2 text-gray-400 text-sm">
                <span>🗓️ {formatDate(p.inserted_at)}</span>
                {isAdmin && (
                  <span>
                    <button
                      onClick={() => {
                        setEditId(p.id);
                        setCaption(p.caption);
                        setEditMediaUrl(p.media_url);
                        setEditMediaType(p.type);
                      }}
                      className="text-yellow-400 hover:underline mr-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:underline text-sm"
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
                  className="mb-3 w-full max-h-64 object-cover rounded cursor-pointer"
                  onClick={() => setLightbox(p)}
                />
              )}

              {p.type === "video" && p.media_url && (
                <video
                  src={p.media_url}
                  controls
                  className="mb-3 w-full max-h-64 rounded cursor-pointer"
                  onClick={() => setLightbox(p)}
                />
              )}

              {p.type === "text" && <p className="text-gray-300">{p.caption}</p>}
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
          <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white text-2xl"
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
