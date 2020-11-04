import { genres } from "./genres";

const DOMSelectors = {
  grid: document.querySelector(".movie-grid"),
  searchMovieTitle: document.querySelector("#search-movie-name"),
  searchMovieSubmit: document.querySelector("#search-movie-submit"),
  next: document.querySelector("#next"),
  prev: document.querySelector("#prev"),
};

function display(results) {
  // clear all on movie grid
  DOMSelectors.grid.innerHTML = "";
  // display each movie from query
  results.forEach((movie) => {
    DOMSelectors.grid.insertAdjacentHTML(
      "beforeend",
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
        <h3 class="movie-card-header">${movie.title}</h3>
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
}

async function fetchDisplayQuery(query, page) {
  try {
    const response = await fetch(query);
    const data = await response.json();
    // if it has no data, throw error to be catched
    if (data.results.length === 0) throw Error;
    // else, display
    display(data.results);
  } catch (error) {
    console.log(error);
    return 1;
  }
}

function makeQuery(searchBool, page, search = "") {
  const apiKey = "e0ddda2b8af45601dfef37a0cd439cac";
  const defaultQuery = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${page}&vote_count.gte=1000&vote_average.gte=8`;
  const searchQuery = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${search}&page=${page}&include_adult=false`;
  if (!searchBool) return defaultQuery;
  else return searchQuery;
}

function init() {
  let page = 1;
  let search;
  let searchBool = 0;

  // display default query
  const currentQuery = makeQuery(searchBool, page, search);
  fetchDisplayQuery(currentQuery);

  // event listener for search
  DOMSelectors.searchMovieSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    searchBool = 1;
    search = DOMSelectors.searchMovieTitle.value;
    const currentQuery = makeQuery(searchBool, page, search)
    fetchDisplayQuery(currentQuery);
  });

  DOMSelectors.next.addEventListener("click", async function() {
    page++;
    const currentQuery = makeQuery(searchBool, page, search);
    const res = await fetchDisplayQuery(currentQuery, page);
    if (res) page--;
  });

  DOMSelectors.prev.addEventListener("click", async function() {
    page--;
    const currentQuery = makeQuery(searchBool, page, search);
    const res = await fetchDisplayQuery(currentQuery);
    if (res) page++;
  });
}
init();
