import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { insertContent } from './create-markup';

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
    loadMore.classList.add('visually-hidden');
    galleryRef.innerHTML = '';
    currentPage = 1;
  }
};

const handleSubmit = async event => {
  event.preventDefault();
  clearPreviousSearch();
  try {
    const url = await createUrl();
    const response = await axios.get(url);
    const { data } = response;

    if (event.type === 'submit') {
      notifyUser(data);
    }

    insertContent(data.hits);
    handlePagination(data);
  } catch (error) {
    console.log(error);
  }
};

form.addEventListener('submit', handleSubmit);
loadMore.addEventListener('click', handleSubmit);
