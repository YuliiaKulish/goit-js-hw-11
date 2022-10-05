import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnSearch: document.querySelector('.search-form-button'),
  targetElement: document.querySelector('.target-element'),
};

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        fetch();
      }
    });
  },
  {
    threshold: 0.5,
  }
);
let inputValue = '';
let page = 1;
let totalPage = 0;
let totalRenderItem = 0;

refs.form.addEventListener('submit', fetchImage);

function fetchImage(e) {
  e.preventDefault();
  const { searchQuery } = e.target.elements;
  inputValue = searchQuery.value.trim().toLowerCase();
  if (!inputValue) {
    return Notify.failure('Enter search');
  }
  clearGallery();
  totalRenderItem = 0;
  fetch();
}

function fetch() {
  fetchImages(inputValue, page).then(data => {
    totalPage = Math.ceil(data.totalHits / 40);
    if (data.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (page !== totalPage) {
      renderImages(data);
      observer.observe(document.querySelector('.photo-card:last-child'));
      page += 1;
    } else if (page === totalPage) {
      renderImages(data);
    }
  });
}

function renderImages(data) {
  const imagesArr = data.hits;
  const totalHits = data.totalHits;

  if (page === 1) {
    Notify.info(`Hooray! We found ${data.totalHits} images.`);
  }
  makeMarkup(imagesArr, totalHits);
}

function makeMarkup(arr, totalHits) {
  totalRenderItem += arr.length;
  if (totalRenderItem > 40 && totalRenderItem >= 500 ) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  if (totalRenderItem > 40 && totalRenderItem === totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  const markup = arr.map(
    ({
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `<div class="photo-card">
  <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
   <div class="info">
      <p class="info-item">
<b>Likes</b> <span class="info-item-api"> ${likes} </span>
</p>
       <p class="info-item">
           <b>Views</b> <span class="info-item-api">${views}</span>  
       </p>
       <p class="info-item">
           <b>Comments</b> <span class="info-item-api">${comments}</span>  
       </p>
       <p class="info-item">
           <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
       </p>
   </div>
</div>`
  );
  refs.gallery.insertAdjacentHTML('beforeend', markup.join(''));

  new SimpleLightbox('.photo-card a ', {
    captionsData: 'alt',
    captionDelay: 250,
  });

}

function clearGallery() {
  refs.gallery.innerHTML = '';
  page = 1;
}