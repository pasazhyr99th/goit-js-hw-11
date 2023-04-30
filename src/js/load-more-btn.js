export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.button = document.querySelector(selector);
    hidden && this.hide();
  }

  enable() {
    this.button.disabled = false;
    this.button.textContent = 'Load more';
  }

  disable() {
    this.button.disabled = true;
    this.button.textContent = 'Loading...';
  }

  show() {
    this.button.classList.remove('is-hidden');
  }

  hide() {
    this.button.classList.add('is-hidden');
  }
}
