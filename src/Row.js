import React, { useState, useEffect } from 'react';
import axios from "./axios";
import "./Row.css";
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/";

//destructuring props
function Row({ title, fetchUrl, isLargeRow }) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");


    //A snippet of code which runs based on a specific condition
    useEffect(() => {
        // If [] is empty then run only once when this component loads and dont run again
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            // axios.get(fetchurl) baseurl+fetchurl => https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl])

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
                .then((url) => {
                    console.log(url);
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                })
                .catch((error) => console.log(error.message));
        }

    };



    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {movies.map(movie => (
                    <img
                        onClick={() => handleClick(movie)}
                        key={movie.id}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;

