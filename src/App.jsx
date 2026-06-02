import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "54d24107";

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");
    const [selectedMovie, setSelectedMovie] = useState("");

    useEffect(() => {
        async function fetchMovies() {
            try {
                if (query.length < 3) throw new Error("Search for your movie");

                setIsError("");
                setIsLoading(true);
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${key}&s=${query}`
                );

                if (!res.ok) throw new Error("Something went Wrong");
                setIsLoading(false);

                const data = await res.json();

                if (data.Response === "False") throw new Error(data.Error);

                setIsError("");
                setMovies(data.Search);
            } catch (err) {
                setIsError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovies();
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
                            <MovieList watched={watched} />
                        </>
                    ) : (
                        <SelctedMovie
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
            {movies?.map((movie) => (
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
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched?.length} movies</span>
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

function MovieList({ watched }) {
    return (
        <ul className="list list-movies">
            {watched.map((movie) => (
                <li key={movie.imdbID}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                        <p>
                            <span>⭐️</span>
                            <span>{movie.imdbRating}</span>
                        </p>
                        <p>
                            <span>🌟</span>
                            <span>{movie.userRating}</span>
                        </p>
                        <p>
                            <span>⏳</span>
                            <span>{movie.runtime} min</span>
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function Search({ query, setQuery }) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

function SelctedMovie({ selectedMovie, setSelectedMovie }) {
    const [movie, setmovie] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState("");

    const {
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
                setmovie(data);
                if (data.Response === "False") throw new Error(data.Error);
            } catch (err) {
                setIsError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovies();
    }, [selectedMovie]);
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
                        <img src={poster} alt={`poster of ${poster}`}></img>
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
                            <StarRating
                                maxRating={10}
                                size="25px"
                                color="#fcc419"
                                // message={["Terrible", "bad", "nice", "good", "perfect"]}
                                defaultRating={1}
                            />
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
