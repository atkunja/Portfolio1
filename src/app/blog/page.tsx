"use client";

import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";

const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN!;

type Post = {
  id: number;
  caption: string;
  mediaURL?: string;
  type: "image" | "video" | "text";
  timestamp: string;
};

export default function BlogPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<Post | null>(null);

  // hydrate from localStorage
  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
    const stored = localStorage.getItem("blog_posts");
    if (stored) setPosts(JSON.parse(stored));
  }, []);

  // persist posts & admin flag
  useEffect(() => {
    localStorage.setItem("blog_posts", JSON.stringify(posts));
  }, [posts]);
  useEffect(() => {
    localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
  }, [isAdmin]);

  const handleLogin = () => {
    if (password === ADMIN_TOKEN) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
    } else {
      alert("Wrong password");
    }
  };
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  const handleSubmit = () => {
    if (!media && !caption.trim()) return;
    const url = media ? URL.createObjectURL(media) : undefined;
    const type: Post["type"] = media
      ? media.type.startsWith("video")
        ? "video"
        : "image"
      : "text";
    const newPost: Post = {
      id: editId ?? Date.now(),
      caption,
      mediaURL: url,
      type,
      timestamp: new Date().toISOString(),
    };
    setPosts((prev) =>
      editId != null
        ? prev.map((p) => (p.id === editId ? newPost : p))
        : [newPost, ...prev]
    );
    setMedia(null);
    setCaption("");
    setEditId(null);
  };

  const handleDelete = (id: number) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="relative bg-[#0A0C12] min-h-screen text-white">
      {/* Login / Logout */}
      {isAdmin ? (
        <button
          onClick={handleLogout}
          className="absolute top-4 left-4 bg-red-600 hover:bg-red-500 text-sm px-3 py-1 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-500 text-sm px-3 py-1 rounded"
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
          {/* backdrop */}
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <Dialog.Title className="mb-4 text-xl font-semibold">
              Enter Admin Password
            </Dialog.Title>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 mb-4 bg-gray-800 rounded outline-none"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-500 py-2 rounded"
            >
              Login
            </button>
          </div>
        </Dialog>
      </Transition>

      <section className="mx-auto max-w-3xl px-4 pt-24 pb-10">
        <h1 className="text-4xl text-cyan-400 font-bold text-center mb-8">
          Blog
        </h1>

        {isAdmin && (
          <div className="mb-10 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
              className="mb-3 block w-full text-sm text-white"
            />
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

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span>🗓️</span>
                  <time dateTime={post.timestamp}>
                    {formatDate(post.timestamp)}
                  </time>
                </div>
                {isAdmin && (
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditId(post.id);
                        setCaption(post.caption);
                      }}
                      className="text-yellow-400 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* media or text */}
              {post.type === "image" && post.mediaURL && (
                <img
                  src={post.mediaURL}
                  alt=""
                  className="mb-3 w-full max-h-64 object-cover rounded cursor-pointer"
                  onClick={() => setLightbox(post)}
                />
              )}
              {post.type === "video" && post.mediaURL && (
                <video
                  src={post.mediaURL}
                  controls
                  className="mb-3 w-full max-h-64 rounded cursor-pointer"
                  onClick={() => setLightbox(post)}
                />
              )}
              {post.type === "text" && (
                <p className="text-gray-300">{post.caption}</p>
              )}
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
            {lightbox?.type === "image" && lightbox.mediaURL && (
              <Image
                src={lightbox.mediaURL}
                alt=""
                width={800}
                height={600}
                style={{ objectFit: "contain" }}
                className="max-h-screen max-w-screen"
              />
            )}
            {lightbox?.type === "video" && lightbox.mediaURL && (
              <video
                src={lightbox.mediaURL}
                controls
                autoPlay
                className="max-h-screen max-w-screen"
              />
            )}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ×
            </button>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
