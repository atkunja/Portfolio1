"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;

type Post = {
  id: number;
  content: string;
  mediaURL?: string;
  type?: "image" | "video";
  timestamp: Date;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [media, setMedia] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [pwInput, setPwInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  function login() {
    if (pwInput === ADMIN_TOKEN) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      setLoginOpen(false);
      setPwInput("");
    } else {
      alert("Incorrect password");
    }
  }

  function logout() {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  }

  function handlePost() {
    if (!media && !content.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      content,
      timestamp: new Date(),
    };
    if (media) {
      const url = URL.createObjectURL(media);
      newPost.mediaURL = url;
      newPost.type = media.type.startsWith("video") ? "video" : "image";
    }
    setPosts([newPost, ...posts]);
    setMedia(null);
    setContent("");
  }

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
      {/* admin UI */}
      <div className="fixed top-4 left-4 z-50 flex items-center space-x-2">
        {isAdmin ? (
          <button onClick={logout} className="text-xs bg-red-600 px-2 py-1 rounded">
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="text-xs bg-blue-600 px-2 py-1 rounded"
            >
              Admin Login
            </button>
            {loginOpen && (
              <div className="ml-2 p-2 bg-gray-800 rounded shadow border border-gray-700">
                <input
                  type="password"
                  placeholder="Password"
                  value={pwInput}
                  onChange={(e) => setPwInput(e.target.value)}
                  className="w-32 mb-2 p-1 bg-gray-700 rounded text-xs"
                />
                <button onClick={login} className="w-full bg-green-600 py-1 rounded text-xs">
                  Login
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <section className="max-w-3xl mx-auto mt-16 mb-20 px-4">
        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">Blog</h1>

        {isAdmin && (
          <div className="bg-gray-800 p-6 rounded-xl mb-10 border border-gray-700 space-y-4">
            {/* file chooser */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-700 px-4 py-2 rounded text-sm"
              >
                Choose File
              </button>
              <span className="text-sm text-gray-300">
                {media?.name || "No file chosen"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMedia(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            {/* text area */}
            <textarea
              placeholder="Write your post here…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded h-24 resize-none border border-gray-600"
            />

            <button
              onClick={handlePost}
              disabled={!media && !content.trim()}
              className="bg-cyan-600 px-5 py-2 rounded text-sm font-semibold disabled:opacity-50"
            >
              Post
            </button>
          </div>
        )}

        {/* posts */}
        <div className="space-y-8">
          {posts.map((p) => (
            <article key={p.id} className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800">
              <div className="text-gray-500 text-sm mb-2 flex items-center">
                <span className="mr-2">🗓️</span>
                <time dateTime={p.timestamp.toISOString()}>{formatDate(p.timestamp)}</time>
              </div>

              {p.mediaURL && p.type === "image" && (
                <Image
                  src={p.mediaURL}
                  alt=""
                  width={800}
                  height={450}
                  className="rounded mb-3 object-cover w-full max-h-[450px]"
                />
              )}
              {p.mediaURL && p.type === "video" && (
                <video src={p.mediaURL} controls className="rounded mb-3 w-full max-h-[450px]" />
              )}

              {p.content && <p className="text-gray-300 whitespace-pre-wrap">{p.content}</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
