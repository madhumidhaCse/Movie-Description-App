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

	const getFullMovieDetails = async (movieId) => {
		const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=eccc01dae6fffc3ad5382fc33b03f597&append_to_response=credits`;

		try {
			const response = await fetch(url);
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
		const url = `https://api.themoviedb.org/3/search/movie?api_key=eccc01dae6fffc3ad5382fc33b03f597&query=${searchValue}`;

		try {
			const response = await fetch(url);
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
				/>4az
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
