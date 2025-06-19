
const MovieList = (props) => {
	const FavouriteComponent = props.favouriteComponent;

	return (
		<>
			{props.movies?.length > 0 ? (
				props.movies.map((movie, index) => (
					<div
						className='image-container d-flex flex-column m-3'
						key={index}
						style={{
							width: '220px',
							background: '#111',
							borderRadius: '10px',
							padding: '10px',
							color: 'white',
						}}
					>
						<img
							src={movie.Poster}
							alt={movie.Title}
							style={{ width: '100%', borderRadius: '6px' }}
						/>
						<h6 className='mt-2 mb-1'>{movie.Title} ({movie.Year})</h6>
						<p style={{ fontSize: '13px' }}>⭐ {movie.Rating}</p>
						<p style={{ fontSize: '13px' }}><strong>Director:</strong> {movie.Director}</p>
						<p style={{ fontSize: '13px' }}><strong>Stars:</strong> {movie.Cast}</p>
						<p style={{ fontSize: '13px' }}><strong>Runtime:</strong> {movie.Runtime}</p>
						<p style={{ fontSize: '13px' }}><strong>Release:</strong> {movie.ReleaseDate}</p>
						<p
							style={{
								fontSize: '12px',
								maxHeight: '100px',
								overflowY: 'auto',
								background: '#222',
								padding: '8px',
								borderRadius: '5px',
							}}
						>
							{movie.Description}
						</p>
						<div
							onClick={() => props.handleFavouritesClick(movie)}
							className='overlay d-flex align-items-center justify-content-center mt-2'
							style={{
								cursor: 'pointer',
								background: '#333',
								color: 'white',
								borderRadius: '5px',
								padding: '6px',
								fontSize: '14px',
							}}
						>
							<FavouriteComponent />
						</div>
					</div>
				))
			) : (
				<div style={{ color: 'white', marginLeft: '1rem', marginTop: '1rem' }}>
					No movies found.
				</div>
			)}
		</>
	);
};

export default MovieList;
