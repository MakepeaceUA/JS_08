import { MovieService } from './MovieService.js';

const form = document.getElementById('search-form');
const resultsDiv = document.getElementById('results');
const paginationDiv = document.getElementById('pagination');
const detailsDiv = document.getElementById('movie-details');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loader');
const moreContainer = document.getElementById('more-container');
const modal = document.getElementById('modal');
const modalLoader = document.getElementById('modal-loader');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

let currentPage = 1;
let currentSearch = {
  title: '',
  type: '',
  totalResults: 0
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  currentSearch.title = document.getElementById('title').value.trim();
  currentSearch.type = document.getElementById('type').value;
  currentPage = 1;
  await fetchMovies(currentPage);
});

modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
  modalBody.innerHTML = '';
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
  }
});

async function fetchMovies(page, append = false) {
  loader.style.display = 'block';

  try {
    const data = await MovieService.search(currentSearch.title, currentSearch.type, page);

    loader.style.display = 'none';

    if (!append) {
      resultsDiv.innerHTML = '';
      paginationDiv.innerHTML = '';
      detailsDiv.innerHTML = '';
      moreContainer.innerHTML = '';
    }

    if (data.Response === "True") {
      currentSearch.totalResults = parseInt(data.totalResults);
      renderMovies(data.Search);

      const totalPages = Math.ceil(currentSearch.totalResults / 10);
      if (page < totalPages) {
        showMoreButton(page + 1);
      }
    } else {
      resultsDiv.innerHTML = `<div class="error-message">${data.Error}</div>`;
    }
  } catch (error) {
    loader.style.display = 'none';
    errorMessage.textContent = 'Ошибка при загрузке данных';
  }
}

function renderMovies(movies) {
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/250x350?text=No+Image'}" alt="${movie.Title}">
      <div class="card-body">
        <h3>${movie.Title}</h3>
        <p>${movie.Year} | ${movie.Type}</p>
        <button class="details-button" data-id="${movie.imdbID}">Детали</button>
      </div>
    `;
    resultsDiv.appendChild(card);
  });

  const buttons = resultsDiv.querySelectorAll('.details-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      fetchDetails(button.dataset.id);
    });
  });
}

async function fetchDetails(imdbID) {
  modal.style.display = 'block';
  modalLoader.style.display = 'block';
  modalBody.innerHTML = '';

  try {
    const data = await MovieService.getMovie(imdbID);
    modalLoader.style.display = 'none';

    if (data.Response === "True") {
      modalBody.innerHTML = `
        <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" 
             alt="${data.Title}" style="width: 200px; float: left; margin-right: 20px; border-radius: 5px;">
        <h2>${data.Title} (${data.Year})</h2>
        <p><strong>Жанр:</strong> ${data.Genre}</p>
        <p><strong>Режиссёр:</strong> ${data.Director}</p>
        <p><strong>Актёры:</strong> ${data.Actors}</p>
        <p><strong>Описание:</strong> ${data.Plot}</p>
        <p><strong>IMDB рейтинг:</strong> ${data.imdbRating}</p>
        <div style="clear: both;"></div>
      `;
    } else {
      modalBody.innerHTML = `<p class="error-message">${data.Error}</p>`;
    }
  } catch (error) {
    modalLoader.style.display = 'none';
    modalBody.innerHTML = `<p class="error-message">Ошибка при загрузке данных</p>`;
  }
}

function showMoreButton(nextPage) {
  moreContainer.innerHTML = '';
  const btn = document.createElement('button');
  btn.id = 'more-button';
  btn.textContent = 'More';
  btn.addEventListener('click', () => {
    currentPage = nextPage;
    fetchMovies(currentPage, true);
  });
  moreContainer.appendChild(btn);
}