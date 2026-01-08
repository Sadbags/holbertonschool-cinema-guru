import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "../../components/movies/Filter";
import MovieCard from "../../components/movies/MovieCard";

const API_BASE = "http://localhost:8000";

export default function HomePage() {
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [sort, setSort] = useState("");
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(`${API_BASE}/api/titles/advancedsearch`, {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: {
            title: title || undefined,
            minYear: minYear || undefined,
            maxYear: maxYear || undefined,
            sort: sort || undefined,
            genres: genres.length ? genres.join(",") : undefined,
          },
        });

        console.log("Movies from backend =>", res.data);
        setMovies(res.data?.titles || []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching movies:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
    return () => controller.abort();
  }, [title, minYear, maxYear, sort, genres]);

  return (
    <div className="dashboard-page">
      <Filter
        minYear={minYear}
        setMinYear={setMinYear}
        maxYear={maxYear}
        setMaxYear={setMaxYear}
        sort={sort}
        setSort={setSort}
        genres={genres}
        setGenres={setGenres}
        title={title}
        setTitle={setTitle}
      />

      {loading && <p style={{ color: "#fff" }}>Loading...</p>}

      <ul className="movies-list">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbId} movie={movie} />
        ))}
      </ul>
    </div>
  );
}
