import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
    arr.length === 0 ? 0 : arr.reduce((acc, cur) => acc + cur, 0) / arr.length;

const key = "54d24107";

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);

    const [watched, setWatched] = useState(function () {
        const stored = localStorage.getItem("watched");
        return stored ? JSON.parse(stored) : [];
    });

    const [isLoading, setIsLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState("");
    const [isError, setIsError] = useState("");

    useEffect(() => {
        localStorage.setItem("watched", JSON.stringify(watched));
    }, [watched]);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchMovies() {
            try {
                if (query.length < 3) throw new Error("Search for your movie");

                setIsError("");
                setIsLoading(true);
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
                    { signal: controller.signal }
                );

                if (!res.ok) throw new Error("Something went Wrong");
                setIsLoading(false);

                const data = await res.json();

                if (data.Response === "False") throw new Error(data.Error);

                setIsError("");
                setMovies(data.Search);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setIsError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovies();

        return () => controller.abort();
    }, [query]);

    return (
        <>
            <Navbar>
                <Search query={query} setQuery={setQuery} />
                <FoundMovies movies={movies} />
            </Navbar>
            <Main>
                <Box>
                    {isLoading && <Loader />}

                    {isError && <Message message={isError} />}

                    {!isLoading && !isError && (
                        <RenderApiMovieBox
                            setSelectedMovie={setSelectedMovie}
                            movies={movies}
                        />
                    )}
                </Box>
                <Box>
                    {!selectedMovie ? (
                        <>
                            <Summary watched={watched} />
                            <MovieList
                                watched={watched}
                                setWatched={setWatched}
                            />
                        </>
                    ) : (
                        <SelectedMovie
                            watched={watched}
                            setWatched={setWatched}
                            setSelectedMovie={setSelectedMovie}
                            selectedMovie={selectedMovie}
                        />
                    )}
                </Box>
            </Main>
        </>
    );
}

function Message({ message }) {
    return <p className="error">{message}</p>;
}

function Navbar({ children }) {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
}

function RenderApiMovieBox({ movies, setSelectedMovie }) {
    return (
        <ul className="list">
            {movies.map((movie) => (
                <li
                    onClick={() =>
                        setSelectedMovie((selected) =>
                            selected === movie.imdbID ? null : movie.imdbID
                        )
                    }
                    key={movie.imdbID}
                >
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                        <p>
                            <span>🗓</span>
                            <span>{movie.Year}</span>
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function Summary({ watched }) {
    const avgImdbRating = Math.round(
        average(watched.map((movie) => Number(movie.imdbRating)))
    );
    const avgUserRating = Math.round(
        average(watched.map((movie) => movie.rate))
    );
    const avgRuntime = Math.round(
        average(watched.map((movie) => movie.numRuntime))
    );
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

function MovieList({ watched, setWatched }) {
    return (
        <ul className="list list-movies">
            {watched.map(
                ({ imdbID, title, poster, imdbRating, rate, numRuntime }) => (
                    <li key={imdbID}>
                        <img src={poster} alt={`${title} poster`} />
                        <h3>{title}</h3>
                        <div>
                            <p>
                                <span>⭐️</span>
                                <span>{imdbRating}</span>
                            </p>
                            <p>
                                <span>🌟</span>
                                <span>{rate}</span>
                            </p>
                            <p>
                                <span>⏳</span>
                                <span>{numRuntime} min</span>
                            </p>
                        </div>
                        <button
                            onClick={() =>
                                deleteWatched({ imdbID, setWatched })
                            }
                            className="btn-delete"
                        >
                            X
                        </button>
                    </li>
                )
            )}
        </ul>
    );
}

function Search({ query, setQuery }) {
    const searchBar = useRef(null);

    useEffect(() => {
        const callBack = function (e) {
            if (document.activeElement === searchBar.current) return;

            if (e.code === "Enter") {
                console.log("sex ? ");
                searchBar.current.focus();
                setQuery("");
            }
        };
        searchBar.current.focus();
        document.addEventListener("keydown", callBack);

        return () => document.removeEventListener("keydown", callBack);
    }, [setQuery]);

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={searchBar}
        />
    );
}

function FoundMovies({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies?.length}</strong> results
        </p>
    );
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

function Loader() {
    return <p className="loader">Loading ...</p>;
}

function SelectedMovie({
    watched,
    setWatched,
    selectedMovie,
    setSelectedMovie
}) {
    const [movie, setMovie] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [rate, setRate] = useState(0);

    const {
        imdbID,
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre
    } = movie;

    const watchedMovie = watched.find((movie) => movie.imdbID === imdbID);
    const isWatched = Boolean(watchedMovie);
    const isWatchedRating = watchedMovie?.rate;

    useEffect(() => {
        async function fetchMovies() {
            try {
                setIsError("");
                setIsLoading(true);
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${key}&i=${selectedMovie}`
                );

                if (!res.ok) throw new Error("Something went Wrong");
                setIsLoading(false);

                const data = await res.json();

                if (data.Response === "False") throw new Error(data.Error);

                setIsError("");
                setMovie(data);
            } catch (err) {
                setIsError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovies();
    }, [selectedMovie]);

    useEffect(() => {
        if (!title) return;

        document.title = title;

        return () => {
            document.title = "usePopcorn";
        };
    }, [title]);

    useEffect(() => {
        const callBack = (e) => {
            if (e.code === "Escape") {
                setSelectedMovie(null);
            }
        };
        document.addEventListener("keydown", callBack);
        return () => document.removeEventListener("keydown", callBack);
    }, [setSelectedMovie]);

    return (
        <>
            {isLoading && <Loader />}
            {isError && <Message message={isError} />}
            {!isLoading && !isError && (
                <div className="details">
                    <header>
                        <button
                            onClick={() => setSelectedMovie(null)}
                            className="btn-back"
                        >
                            &larr;
                        </button>
                        <img src={poster} alt={`poster of ${title}`}></img>
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDb Rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {isWatched ? (
                                <div>
                                    You already watched it and rate it with{" "}
                                    {isWatchedRating}⭐
                                </div>
                            ) : (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size="25px"
                                        color="#fcc419"
                                        defaultRating={0}
                                        setRate={setRate}
                                    />
                                    {rate > 0 ? (
                                        <button
                                            onClick={() =>
                                                addToMovieList({
                                                    watched,
                                                    imdbRating,
                                                    rate,
                                                    runtime,
                                                    poster,
                                                    title,
                                                    imdbID,
                                                    setWatched,
                                                    setSelectedMovie
                                                })
                                            }
                                            className="btn-add"
                                        >
                                            Add to watch list +
                                        </button>
                                    ) : null}
                                </>
                            )}
                        </div>

                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </div>
            )}
        </>
    );
}

function addToMovieList({
    imdbRating,
    rate,
    runtime,
    poster,
    title,
    imdbID,
    setWatched,
    setSelectedMovie,
    watched
}) {
    const numRuntime = runtime >= 0 ? Number(runtime.replace(" min", "")) : 0;

    console.log(numRuntime);

    setWatched((watched) => [
        ...watched,
        { imdbRating, rate, numRuntime, poster, title, imdbID }
    ]);

    setSelectedMovie(null);
}

function deleteWatched({ imdbID, setWatched }) {
    setWatched((watched) =>
        watched?.filter((movie) => movie.imdbID !== imdbID)
    );
}
