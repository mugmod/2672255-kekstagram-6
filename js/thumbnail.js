import { openBigPicture } from './big-picture.js';

const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainer = document.querySelector('.pictures');

const createThumbnail = (photoData) => {
  const thumbnail = pictureTemplate.cloneNode(true);
  const image = thumbnail.querySelector('.picture__img');

  image.src = photoData.url;
  image.alt = photoData.description;
  thumbnail.querySelector('.picture__comments').textContent = photoData.comments.length;
  thumbnail.querySelector('.picture__likes').textContent = photoData.likes;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    // ПЕРЕДАЕМ ВТОРОЙ АРГУМЕНТ ДЛЯ ПОДСВЕТКИ
    openBigPicture(photoData, thumbnail);
  });

  return thumbnail;
};

export const renderThumbnails = (photos) => {
  const imgUploadSection = picturesContainer.querySelector('.img-upload');
  picturesContainer.querySelectorAll('.picture').forEach((el) => el.remove());

  const fragment = document.createDocumentFragment();
  photos.forEach((photo) => {
    fragment.appendChild(createThumbnail(photo));
  });
  picturesContainer.insertBefore(fragment, imgUploadSection);
};
