export { createMarkUp, generateMarkUp, insertContent };

const createMarkUp = hit => {
  return `<a class="gallery__item" href="${hit.largeImageURL}">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="gallery__image"/>
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
  const galleryRef = document.querySelector('.gallery');
  galleryRef.insertAdjacentHTML('beforeend', result);
  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
};
