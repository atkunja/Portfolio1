"use client";
import { useState } from "react";
import Image from "next/image";

export default function Blog() {
  const [posts, setPosts] = useState<
    { id: number; caption: string; mediaURL: string; type: "image" | "video" }[]
  >([]);
  const [media, setMedia] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const handleSubmit = () => {
    if (!media) return;
    const url = URL.createObjectURL(media);
    const type = media.type.startsWith("video") ? "video" : "image";
    setPosts([{ id: Date.now(), caption, mediaURL: url, type }, ...posts]);
    setMedia(null);
    setCaption("");
  };

  return (
    <section className="max-w-3xl mx-auto mt-16 mb-20 px-4">
      <h1 className="text-4xl font-bold text-cyan-400 text-center mb-6">Blog</h1>

      <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-10 border border-gray-700">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files?.[0] || null)}
          className="mb-3 block w-full text-sm text-white"
        />
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded border border-gray-700"
        />
        <button
          onClick={handleSubmit}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded transition font-semibold"
        >
          Post
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-900 p-4 rounded-xl shadow-md border border-gray-800"
          >
            {post.type === "image" ? (
              <Image
                src={post.mediaURL}
                alt="uploaded image"
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
          </div>
        ))}
      </div>
    </section>
  );
}
