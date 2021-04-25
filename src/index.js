import "./css/style.css";
import { error, Stack } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import 'basiclightbox/dist/basiclightbox.min.css';
import imageTemplate from './templates/imageTemplate.hbs';
import PicturesApiServices from './js/apiService';
import onOpenModalImage from './js/components/modal';

const myStack = new Stack({
  dir1: 'down',
  dir2: 'right',
  firstpos1: 30,
  firstpos2: 1050,
});

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const picturesApiService = new PicturesApiServices();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onOpenModalImage);

async function onSearch(event) {
  event.preventDefault();

  picturesApiService.query = event.currentTarget.elements.query.value;

  picturesApiService.resetPage();

  const response = await picturesApiService.fetchPictures();

  if (response.length === 0) {
    myStack.close();
    error({
      title: 'Nothing found',
      text: 'Please enter more specific query',
      delay: 4000,
      stack: myStack,
    });
    clearGallery();
    refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }

  clearGallery();
  appendPicturesMarkup(response);
  refs.loadMoreBtn.classList.remove('is-hidden');
}

async function onLoadMore() {
  const response = await picturesApiService.fetchPictures();
  appendPicturesMarkup(response);
  scrollTo();
}

function scrollTo() {
  let scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  );
  window.scrollTo({
    top: scrollHeight,
    behavior: 'smooth',
  });
}

function appendPicturesMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imageTemplate(hits));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}