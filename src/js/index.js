import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const searchQuery = document.querySelector('input[name="searchQuery"]');

const KEY = '29465833-2a7a79fc7318dfcd77a5c91cc';
const BASE_URL = 'https://pixabay.com/api/';
const PARAMS = `&image_type=photo&orientation=horizontal&safesearch=true`;
let userSearchData = '';
let currentPage = 1;
let perPage = 40;

const createMarkUp = hit => {
  return `<a class="gallery__item" href="${hit.largeImageURL}">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="gallery__image/>
            <div class="info">
              <p class="info-item">
                <b>Likes ${hit.likes}</b>
              </p>
              <p class="info-item">
                <b>Views ${hit.views}</b>
              </p>
              <p class="info-item">
                <b>Comments ${hit.comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads ${hit.downloads}</b>
              </p>
              </div>       
          </a>`;
};

const generateMarkUp = array =>
  array?.reduce((acc, hit) => acc + createMarkUp(hit), '');

const insertContent = array => {
  const result = generateMarkUp(array);
  galleryRef.insertAdjacentHTML('beforeend', result);
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
};

const notifyUser = data => {
  if (data.totalHits) {
    Notify.success(`Hooray! We found ${data?.totalHits} images.`);
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const createUrl = () => {
  userSearchData = searchQuery.value.replace(' ', '+');
  const url = `${BASE_URL}?key=${KEY}&q=${userSearchData}&${PARAMS}&per_page=${perPage}&page=${currentPage}`;
  return url;
};

const handlePagination = data => {
  currentPage += 1;
  if (currentPage >= 2) {
    loadMore.classList.remove('visually-hidden');
  }

  if (currentPage > Math.ceil(data?.totalHits / perPage)) {
    loadMore.classList.add('visually-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
};

const clearPreviousSearch = () => {
  if (userSearchData !== '' && userSearchData !== searchQuery.value) {
    galleryRef.innerHTML = '';
    currentPage = 1;
  }
};

const handleSubmit = event => {
  event.preventDefault();
  clearPreviousSearch();
  const url = createUrl();

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (event.type === 'submit') {
        notifyUser(data);
      }
      console.log(createMarkUp(data));
      insertContent(data.hits);

      handlePagination(data);
    })
    .catch(error => {
      console.log('error', error);
    });
};

form.addEventListener('submit', handleSubmit);
loadMore.addEventListener('click', handleSubmit);
