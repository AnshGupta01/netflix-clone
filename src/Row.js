import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl]= useState("");

  //A snippet of code which runs based on a specific condition/variable
  useEffect(() => {
    //if [], run once when the row loads, and don't run again
    //if [movies], run once when the row loads, and run again when movies changes
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
    //we add fetchUrl as a dependency because it is being used and imported in the useEffect in the
    //axios.get part
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      //https://developers.google.com/youtube/player_parameters
      autoplay:1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    }
    else {
      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
      .then(url => {
        //https://www.youtube.com/watch?v=XtMThy8QKqU
        //we want to extract the v=XtMThy8QKqU part from the url
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
      }).catch(error => console.log(error));
    }
  }

  return (
    <div className="row">
      <h2>{title}</h2>

      {/* using alt for fallback if image not loaded */}

      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${isLargeRow? movie.poster_path : movie.backdrop_path}`} 
            alt={movie.name}/>
          ))}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts}/>}
    </div>
  );
}

export default Row;
