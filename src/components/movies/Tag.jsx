import { useState } from "react";
import "./movies.css";

export default function Tag({ genre, filter, genres, setGenres }) {
  const [selected, setSelected] = useState(genres.includes(genre));

  const handleTag = () => {
    if (selected) {
      setGenres((prev) => prev.filter((g) => g !== genre));
      setSelected(false);
    } else {
      setGenres((prev) => [...prev, genre]);
      setSelected(true);
    }
  };

  return (
    <li
      className={`tag ${filter ? "tag-filter" : ""} ${
        selected ? "tag-selected" : ""
      }`}
      onClick={handleTag}
    >
      {genre}
    </li>
  );
}
