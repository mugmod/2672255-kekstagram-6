import { isEscapeKey } from './util.js';

// Сначала константы
const COMMENTS_PORTION = 5;

// Затем поиск элементов
const body = document.body;
const bigPicture = document.querySelector('.big-picture');
const bigPictureImgContainer = bigPicture.querySelector('.big-picture__img');
const bigPictureImg = bigPictureImgContainer.querySelector('img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('#picture-cancel');

let onDocumentKeydown;
let activeThumbnail = null;

let commentsToShow = [];
let renderedCommentsCount = 0;

/**
 * Создаёт DOM-элемент комментария
 */
const createCommentElement = (comment) => {
  const li = document.createElement('li');
  li.className = 'social__comment';

  const img = document.createElement('img');
  img.className = 'social__picture';
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const p = document.createElement('p');
  p.className = 'social__text';
  p.textContent = comment.message;

  li.appendChild(img);
  li.appendChild(p);

  return li;
};

const renderNextComments = () => {
  const next = commentsToShow.slice(
    renderedCommentsCount,
    renderedCommentsCount + COMMENTS_PORTION
  );

  const fragment = document.createDocumentFragment();

  next.forEach((c) => {
    fragment.appendChild(createCommentElement(c));
  });

  socialComments.appendChild(fragment);
  renderedCommentsCount += next.length;

  commentCountBlock.innerHTML =
  `<span class="count-badge">Вы лицезреете ${renderedCommentsCount} из ${commentsToShow.length} комментариев</span>`;

  if (renderedCommentsCount >= commentsToShow.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderNextComments();
};

export const closeBigPicture = () => {
  if (activeThumbnail) {
    activeThumbnail.classList.remove('picture--active');
    activeThumbnail = null;
  }

  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }

  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  socialComments.innerHTML = '';
};

export const openBigPicture = (photo, thumbnailElement = null) => {
  if (!photo) {
    return;
  }

  if (activeThumbnail) {
    activeThumbnail.classList.remove('picture--active');
  }
  if (thumbnailElement) {
    activeThumbnail = thumbnailElement;
    activeThumbnail.classList.add('picture--active');
  }

  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description || 'Фотография';
  likesCount.textContent = String(photo.likes);
  commentsCount.textContent = String(photo.comments.length);
  socialCaption.textContent = photo.description || '';

  commentCountBlock.classList.remove('hidden');

  commentsToShow = Array.isArray(photo.comments) ? photo.comments : [];
  renderedCommentsCount = 0;
  socialComments.innerHTML = '';

  renderNextComments();

  commentsLoader.addEventListener('click', onCommentsLoaderClick);

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeBigPicture();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown);
  closeButton.onclick = closeBigPicture;
};
