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

  // restore admin from localStorage
  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = () => {
    const pw = prompt("Enter admin password:");
    if (pw === ADMIN_TOKEN) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
    } else {
      alert("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  const handlePost = () => {
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

  const handleDelete = (id: number) => {
    if (confirm("Delete this post?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    const newCaption = prompt("Edit caption:", post.caption);
    if (newCaption !== null) {
      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, caption: newCaption } : p
        )
      );
    }
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* fixed login/logout */}
      <div className="fixed top-4 left-4 z-50">
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
          >
            Admin Login
          </button>
        )}
      </div>

      <section className="max-w-3xl mx-auto mt-16 mb-20 px-4">
        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-6">
          Blog
        </h1>

        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3 justify-center bg-gray-800 p-4 rounded-xl mb-10 border border-gray-700">
            <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm">
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
              onClick={handlePost}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm font-semibold"
            >
              Post
            </button>
          </div>
        )}

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-400 text-sm flex items-center">
                  <span className="mr-2">🗓️</span>
                  <time dateTime={post.timestamp.toISOString()}>
                    {formatDate(post.timestamp)}
                  </time>
                </div>
                {isAdmin && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(post.id)}
                      className="text-xs bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
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

              <p className="text-gray-200">{post.caption}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
