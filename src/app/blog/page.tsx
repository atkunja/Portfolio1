// src/app/blog/page.tsx
"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;

type Post = {
  id: number;
  caption: string;
  mediaURL?: string;
  type?: "image" | "video";
  timestamp: string;
};

export default function BlogPage() {
  // state
  const [posts, setPosts] = useState<Post[]>([]);
  const [media, setMedia] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [lightbox, setLightbox] = useState<Post | null>(null);
  const [editingId, setEditingId] = useState<number| null>(null);

  // load posts & admin from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("blogPosts");
    if (saved) setPosts(JSON.parse(saved));
    if (localStorage.getItem("isAdmin") === "true") {
      setIsAdmin(true);
    }
  }, []);

  // persist posts
  useEffect(() => {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
  }, [posts]);

  // handlers
  function tryLogin() {
    if (pwInput === ADMIN_TOKEN) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      setShowLogin(false);
      setPwInput("");
    } else {
      alert("Bad password");
    }
  }
  function logout() {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  }

  function handleSubmit() {
    const id = editingId ?? Date.now();
    const newPost: Post = {
      id,
      caption,
      mediaURL: media ? URL.createObjectURL(media) : undefined,
      type: media
        ? media.type.startsWith("video")
          ? "video"
          : "image"
        : undefined,
      timestamp: new Date().toISOString(),
    };
    setPosts(prev =>
      editingId
        ? prev.map(p => (p.id === id ? newPost : p))
        : [newPost, ...prev]
    );
    setCaption("");
    setMedia(null);
    setEditingId(null);
  }

  function deletePost(id: number) {
    if (confirm("Delete this post?")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  }

  function startEdit(p: Post) {
    setEditingId(p.id);
    setCaption(p.caption);
    // we can’t rehydrate File so skip media
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-gray-100 p-4">
      {/* Admin Button */}
      <div className="fixed top-4 left-4 z-20">
        {isAdmin ? (
          <button
            onClick={logout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 text-sm"
          >
            Admin
          </button>
        )}
      </div>

      {/* Login Modal */}
      <Transition show={showLogin} as={Fragment}>
        <Dialog
          onClose={() => setShowLogin(false)}
          className="fixed inset-0 z-30 flex items-center justify-center"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg w-80">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Enter Password
            </Dialog.Title>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 mb-4 focus:outline-none"
              placeholder="Password…"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowLogin(false)}
                className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={tryLogin}
                className="px-4 py-1 bg-green-600 hover:bg-green-500 rounded"
              >
                Login
              </button>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Header */}
      <h1 className="text-5xl font-bold text-center mb-8 tracking-tight drop-shadow-md text-cyan-400">
        ✨ My Aesthetic Blog ✨
      </h1>

      {/* Post Form */}
      {isAdmin && (
        <div className="max-w-xl mx-auto mb-8 bg-gray-900 bg-opacity-70 p-6 rounded-lg">
          <label className="block mb-2">
            <span className="text-gray-300">Media (opt):</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm text-gray-100 bg-gray-800 border border-gray-700 rounded focus:ring-cyan-400"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-300">Write your post:</span>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="mt-1 block w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:ring-cyan-400"
            />
          </label>
          <button
            onClick={handleSubmit}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded"
          >
            {editingId ? "Update" : "Post"}
          </button>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-gray-900 bg-opacity-70 p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <time className="text-xs text-gray-400">
                📅 {formatDate(p.timestamp)}
              </time>
              {isAdmin && (
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-sm text-yellow-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(p.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            {p.mediaURL && (
              <div
                className="cursor-pointer mb-2 mx-auto max-w-full"
                onClick={() => setLightbox(p)}
              >
                {p.type === "video" ? (
                  <video
                    src={p.mediaURL}
                    className="rounded max-h-48 w-auto"
                    controls={false}
                  />
                ) : (
                  <Image
                    src={p.mediaURL}
                    alt=""
                    width={400}
                    height={225}
                    className="rounded object-cover"
                  />
                )}
              </div>
            )}
            <p className="text-gray-200">{p.caption}</p>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Transition show={!!lightbox} as={Fragment}>
        <Dialog
          onClose={() => setLightbox(null)}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/80" />
          <div className="relative max-h-full max-w-full">
            {lightbox?.type === "video" ? (
              <video
                src={lightbox.mediaURL}
                controls
                autoPlay
                className="max-h-screen max-w-screen"
              />
            ) : (
              <Image
                src={lightbox!.mediaURL!}
                alt=""
                width={800}
                height={450}
                className="max-h-screen max-w-screen"
              />
            )}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

