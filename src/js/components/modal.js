import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basiclightbox.min.css';

export default function onOpenModalImage(event) {
  const isImgEl = event.target.classList.contains('gallery__image');
  if (!isImgEl) {
    return;
  }
  const largeImageURL = event.target.getAttribute('data-large-image-url');

  const instance = basicLightbox.create(
    `
    <img width="1400" height="900" src=${largeImageURL}>
  `,
  );
  instance.show();

  window.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      instance.close();
    }
  });
}