import './css/styles.css';
import ApiService from './js/api-service';
import { Notify } from 'notiflix';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const apiService = new ApiService();
const lightbox = new SimpleLightbox('.gallery a');
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchGalleryHits);

function onSearch(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;
  const searching = apiService.query.trim();

  if (!searching) {
    Notify.info('Please enter what you want to find');
    clearGallery();
    loadMoreBtn.hide();
    return;
  }

  loadMoreBtn.show(); // кнопка доступна
  apiService.resetPage();
  clearGallery();
  fetchGalleryHits();
}

async function fetchGalleryHits() {
  loadMoreBtn.disable(); // кнопка недоступна і loading...

  try {
    const data = await apiService.fetchRequest();
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide(); // кнопка схована
      return;
    }

    renderGallery(hits);
    lightbox.refresh(); // оновлення lightbox

    if (apiService.page === 2) {
      Notify.success(`Hooray! We found ${data.hits.length} images.`);
    } else {
      Notify.info(`We found ${data.hits.length} more images.`);

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (refs.gallery.children.length >= totalHits) {
      loadMoreBtn.hide(); // кнопка cхована
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.enable(); // кнопка доступна
    }
  } catch (error) {
    console.log(error.message);
  }
}

function renderGallery(hits) {
  const markup = hits
    .map(data => {
      return `
      <div class="photo-card">
        <a class="gallery__link" href="${data.largeImageURL}">
        <img src="${data.webformatURL}" 
          alt="${data.tags}" 
          loading="lazy" 
          />
        <div class="info">
          <li class="info-item">
            <b>Likes</b>
            <p>${data.likes}</p>
          </li>
          <li class="info-item">
            <b>Views</b>
            <p>${data.views}</p>
          </li>
          <li class="info-item">
            <b>Comments</b>
            <p>${data.comments}</p>
          </li>
          <li class="info-item">
            <b>Downloads</b>
            <p>${data.downloads}</p>
          </li>
        </div>
        </a>
      </div>
      `;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

