import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/?';
const API_KEY = '35772467-21ed811caf8158e0babf87439';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchRequest() {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });

    const response = await axios.get(`${BASE_URL}${searchParams}`);
    const { hits, totalHits } = response.data;
    this.page += 1;
    console.log(response.data);
    return { hits, totalHits };
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
