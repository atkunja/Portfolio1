// src/app/blog/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;

type Post = {
  id: number;
  caption: string;
  mediaURL: string;
  type: "image" | "video";
  timestamp: Date;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [media, setMedia] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // restore admin state on load
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = () => {
    const pw = prompt("Enter admin token:");
    if (pw === ADMIN_TOKEN) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("❌ Incorrect token");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  const handleSubmit = () => {
    if (!media) return;
    const url = URL.createObjectURL(media);
    const type = media.type.startsWith("video") ? "video" : "image";
    setPosts([
      { id: Date.now(), caption, mediaURL: url, type, timestamp: new Date() },
      ...posts,
    ]);
    setMedia(null);
    setCaption("");
  };

  const formatDate = (d: Date) =>
    d.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <section className="relative max-w-3xl mx-auto mt-16 mb-20 px-4">
      {/* top-left login/logout */}
      <div className="absolute top-4 left-4">
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="text-xs bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded"
          >
            Admin Login
          </button>
        )}
      </div>

      <h1 className="text-4xl font-bold text-cyan-400 text-center mb-6">Blog</h1>

      {isAdmin && (
        <div className="flex flex-wrap items-center gap-3 justify-center bg-gray-900 p-4 rounded-2xl shadow-lg mb-10 border border-gray-700">
          <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm">
            Choose File
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMedia(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
          <input
            type="text"
            placeholder="Caption…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 min-w-[150px] p-2 bg-gray-800 text-white rounded text-sm border border-gray-700"
          />
          <button
            onClick={handleSubmit}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            Post
          </button>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800"
          >
            <div className="text-gray-500 text-sm mb-2 flex items-center">
              <span className="mr-2">🗓️</span>
              <time dateTime={post.timestamp.toISOString()}>
                {formatDate(post.timestamp)}
              </time>
            </div>

            {post.type === "image" ? (
              <Image
                src={post.mediaURL}
                alt={post.caption}
                width={800}
                height={450}
                className="rounded mb-3 object-cover w-full max-h-[450px]"
              />
            ) : (
              <video
                src={post.mediaURL}
                controls
                className="rounded mb-3 w-full max-h-[450px]"
              />
            )}

            <p className="text-gray-300">{post.caption}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
