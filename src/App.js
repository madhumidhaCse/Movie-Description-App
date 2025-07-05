import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import './App.css';
import AddFavourites from './components/AddFavourites';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import RemoveFavourites from './components/RemoveFavourites';
import SearchBox from './components/SearchBox';

const App = () => {
	const [movies, setMovies] = useState([]);
	const [favourites, setFavourites] = useState([]);
	const [searchValue, setSearchValue] = useState('');

	const TMDB_HEADERS = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization:
				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWU5MjgzMGY0ZGQ2ZTVkNTJkYmFkMjFjZWMxYjkxMCIsIm5iZiI6MTc1MTcwODcxOS40MjksInN1YiI6IjY4NjhmNDJmMzI3YTA1MmVhNDUzZjQwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lDPv1d6cgiVd11f-hT_2pKKduxrQqTxvbcA25v0LLKc',
		},
	};

	const getFullMovieDetails = async (movieId) => {
		const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`;

		try {
			const response = await fetch(url, TMDB_HEADERS);
			const data = await response.json();

			const director = data.credits.crew.find((c) => c.job === "Director")?.name;
			const topCast = data.credits.cast.slice(0, 5).map((c) => c.name).join(", ");

			return {
				Director: director || "Unknown",
				Cast: topCast || "N/A",
				Runtime: data.runtime ? `${data.runtime} min` : "N/A",
				ReleaseDate: data.release_date || "N/A",
				Overview: data.overview || "N/A",
			};
		} catch (error) {
			console.error("Failed to load full movie details:", error.message);
			return {};
		}
	};

	const getMovieRequest = async (searchValue) => {
		const url = `https://api.themoviedb.org/3/search/movie?query=${searchValue}`;

		try {
			const response = await fetch(url, TMDB_HEADERS);
			const data = await response.json();

			if (data.results) {
				const mappedMovies = await Promise.all(
					data.results.map(async (movie) => {
						const fullDetails = await getFullMovieDetails(movie.id);

						return {
							Title: movie.title,
							Year: movie.release_date?.split('-')[0] || 'N/A',
							Poster: movie.poster_path
								? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
								: 'https://via.placeholder.com/200x300?text=No+Image',
							imdbID: movie.id,
							Description: fullDetails.Overview,
							Rating: movie.vote_average,
							Director: fullDetails.Director,
							Cast: fullDetails.Cast,
							Runtime: fullDetails.Runtime,
							ReleaseDate: fullDetails.ReleaseDate,
						};
					})
				);

				setMovies(mappedMovies);
			} else {
				setMovies([]);
			}
		} catch (error) {
			console.error('TMDb fetch failed:', error.message);
			setMovies([]);
		}
	};

	useEffect(() => {
		if (searchValue.trim() !== '') {
			getMovieRequest(searchValue);
		}
	}, [searchValue]);

	useEffect(() => {
		const movieFavourites = JSON.parse(
			localStorage.getItem('react-movie-app-favourites')
		);
		if (movieFavourites) {
			setFavourites(movieFavourites);
		}
	}, []);

	const saveToLocalStorage = (items) => {
		localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
	};

	const addFavouriteMovie = (movie) => {
		const newFavouriteList = [...favourites, movie];
		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	const removeFavouriteMovie = (movie) => {
		const newFavouriteList = favourites.filter(
			(favourite) => favourite.imdbID !== movie.imdbID
		);

		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	return (
		<div className='container-fluid movie-app'>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Movies' />
				<SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
			</div>
			<div className='row'>
				<MovieList
					movies={movies}
					handleFavouritesClick={addFavouriteMovie}
					favouriteComponent={AddFavourites}
				/>
			</div>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Favourites' />
			</div>
			<div className='row'>
				<MovieList
					movies={favourites}
					handleFavouritesClick={removeFavouriteMovie}
					favouriteComponent={RemoveFavourites}
				/>
			</div>
		</div>
	);
};

export default App;

