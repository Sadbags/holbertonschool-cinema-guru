import { useState, useEffect } from "react";
import axios from "axios";
import "./movies.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClock } from "@fortawesome/free-solid-svg-icons";
import unavailablePoster from "../../assets/unavailable1.png";

const API_BASE = "http://localhost:8000";

export default function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  const imdbId = movie?.imdbId;
  const title = movie?.title || "";
  const synopsis = movie?.synopsis || "";

  const imageurls = movie?.imageurls;
  const rawGenres = movie?.genres;

  const genres = Array.isArray(rawGenres)
    ? rawGenres
    : typeof rawGenres === "string"
      ? rawGenres.split(",").map((g) => g.trim()).filter(Boolean)
      : [];

  const poster =
    Array.isArray(imageurls) && imageurls.length > 0
      ? imageurls[0]
      : unavailablePoster;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !imdbId) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchStatus = async () => {
      try {
        const [favRes, watchRes] = await Promise.all([
          axios.get(`${API_BASE}/api/titles/favorite`, { headers }),
          axios.get(`${API_BASE}/api/titles/watchlater`, { headers }),
        ]);

        const favList = favRes.data || [];
        const watchList = watchRes.data || [];

        setIsFavorite(favList.some((m) => m.imdbId === imdbId));
        setIsWatchLater(watchList.some((m) => m.imdbId === imdbId));
      } catch (err) {
        console.error("Error checking favorite/watchlater:", err);
      }
    };

    fetchStatus();
  }, [imdbId]);

  const handleClick = async (type) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !imdbId) return;

    const headers = { Authorization: `Bearer ${token}` };
    const url = `${API_BASE}/api/titles/${type}/${imdbId}`;

    try {
      if (type === "favorite") {
        if (isFavorite) {
          await axios.delete(url, { headers });
          setIsFavorite(false);
        } else {
          await axios.post(url, null, { headers });
          setIsFavorite(true);
        }
      } else if (type === "watchlater") {
        if (isWatchLater) {
          await axios.delete(url, { headers });
          setIsWatchLater(false);
        } else {
          await axios.post(url, null, { headers });
          setIsWatchLater(true);
        }
      }
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
    }
  };

  if (!movie) return null;

  return (
    <li className="movie-card">
      <div className="movie-card-image-wrapper">
        <img className="movie-card-image" src={poster} alt={title} />

        <div className="movie-card-actions">
          <FontAwesomeIcon
            icon={faStar}
            className={`movie-card-icon ${isFavorite ? "active" : ""}`}
            onClick={() => handleClick("favorite")}
          />
          <FontAwesomeIcon
            icon={faClock}
            className={`movie-card-icon ${isWatchLater ? "active" : ""}`}
            onClick={() => handleClick("watchlater")}
          />
        </div>
      </div>

      <div className="movie-card-body">
        <h3 className="movie-card-title">{title}</h3>

        {synopsis && (
          <p className="movie-card-synopsis">{synopsis}</p>
        )}

        <div className="movie-card-genres">
          {genres.map((g) => (
            <span key={g} className="movie-card-genre-tag">
              {g}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}
