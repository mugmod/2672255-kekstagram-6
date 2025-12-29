import { isEscapeKey } from './util.js';

const ALERT_SHOW_TIME = 5000;

const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
const dataErrorMessageTemplate = document.querySelector('#data-error')?.content.querySelector('.data-error');

const body = document.querySelector('body');

function onMessageEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    evt.stopPropagation();
    hideMessage();
  }
}

function onOutsideClick(evt) {
  if (evt.target.closest('.success__inner') || evt.target.closest('.error__inner')) {
    return;
  }
  hideMessage();
}

function hideMessage() {
  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  if (messageElement) {
    messageElement.remove();
  }
  document.removeEventListener('keydown', onMessageEscKeydown);
  document.removeEventListener('click', onOutsideClick);

  const uploadOverlay = document.querySelector('.img-upload__overlay');
  if (!uploadOverlay || uploadOverlay.classList.contains('hidden')) {
    body.classList.remove('modal-open');
  }
}

function showMessage(template, closeButtonClass) {
  const messageElement = template.cloneNode(true);
  messageElement.style.zIndex = '100';
  document.body.append(messageElement);

  const closeButton = messageElement.querySelector(closeButtonClass);

  closeButton.addEventListener('click', hideMessage);
  document.addEventListener('keydown', onMessageEscKeydown);
  document.addEventListener('click', onOutsideClick);

  body.classList.add('modal-open');
}

const showSuccessMessage = () => showMessage(successMessageTemplate, '.success__button');
const showErrorMessage = () => showMessage(errorMessageTemplate, '.error__button');

const showDataErrorMessage = () => {
  if (!dataErrorMessageTemplate) {
    return;
  }
  const dataErrorElement = dataErrorMessageTemplate.cloneNode(true);
  document.body.append(dataErrorElement);

  setTimeout(() => {
    dataErrorElement.remove();
  }, ALERT_SHOW_TIME);
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.style.color = 'white';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

export { showSuccessMessage, showErrorMessage, showAlert, showDataErrorMessage };
