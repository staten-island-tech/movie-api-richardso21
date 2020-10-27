import { genres } from "./genres";

const DOMSelectors = {
  grid: document.querySelector(".movie-grid"),
};

const query = `https://api.themoviedb.org/3/discover/movie?api_key=e0ddda2b8af45601dfef37a0cd439cac&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=1000&vote_average.gte=8`;

async function init() {
  try {
    const response = await fetch(query);
    const data = await response.json();
    console.log(data);

    data.results.forEach((movie) => {
      DOMSelectors.grid.insertAdjacentHTML(
        "beforebegin",
        `
      <div class="movie-card">
        <div class="movie-card-front">
          <img
            src="https://image.tmdb.org/t/p/w500/${movie.poster_path}"
            alt=""
            class="poster"
          />
        </div>
        <div class="movie-card-back">
          <h3 class="movie-card-header">${movie.original_title}</h3>
          <div class="score-box">
            <p class="user-score">Community Score</p>
            <p class="user-score">${movie.vote_average}</p>
          </div>

          <div class="release-box">
            <p class="release-date">Released</p>
            <p class="release-date">${movie.release_date}</p>
          </div>

          <div class="movie-genres">
            ${genres
              .filter((genre) => movie.genre_ids.includes(genre.id))
              .map((genre) => `<li class="movie-genre">${genre.name}</li>`)
              .join("")}
          </div>
        </div>
      </div>
      `
      );
    });
  } catch (error) {
    console.error(error);
  }
}
init();
