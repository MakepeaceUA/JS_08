const API_KEY = '11895a96';
const BASE_URL = 'https://www.omdbapi.com/';

export class MovieService {
  static async search(title, type = '', page = 1) {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title)}&type=${type}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  static async getMovie(movieId) {
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${movieId}&plot=full`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}