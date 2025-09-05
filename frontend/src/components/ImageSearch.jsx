import React, { useState } from "react";

const accesskey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export default function ImageSearch() {
  const [keyword, setKeyword] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const searchImages = async (reset = false) => {
    if (!keyword.trim()) return;
    setLoading(true);
    const url = `https://api.unsplash.com/search/photos?page=${reset ? 1 : page}&query=${keyword}&client_id=${accesskey}&per_page=12`;
    const response = await fetch(url);
    const data = await response.json();
    setImages(reset ? data.results : [...images, ...data.results]);
    setLoading(false);
    if (reset) setPage(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchImages(true);
  };

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
    searchImages();
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-8 max-w-full">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search images..."
          className="border-2 border-purple-300 rounded-lg px-4 py-2 w-full max-w-xs sm:max-w-md text-lg focus:outline-none focus:border-purple-500"
        />
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-purple-700 transition flex-shrink-0">
          Search
        </button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        {images.map((result, idx) => (
          <a key={idx} href={result.links.html} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-lg hover:scale-105 transition">
            <img src={result.urls.small} alt={result.alt_description || "Unsplash Image"} className="w-full h-56 object-cover" />
          </a>
        ))}
      </div>
      {images.length > 0 && (
        <button
          onClick={handleShowMore}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition mb-8"
          disabled={loading}
        >
          {loading ? "Loading..." : "Show More"}
        </button>
      )}
      {images.length === 0 && !loading && (
        <div className="text-gray-400 text-lg mt-8">No images found. Try searching for something!</div>
      )}
    </div>
  );
}
