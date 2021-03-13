import { config, cardsData } from '../Constants/constants';
import { gameObserver } from '../Observer';
import game from '../Game';

export default class Card {
  constructor(elem, idx) {
    this.elem = elem;
    this.idx = idx;
    this.play = false;
    this.page = 0;
    this.isRotate = false;
    this.card = this.elem.querySelector('.card');
    this.events();
    this.stateEvents();
  }

  update(page) {
    this.page = page - 1;

    const { image, word, translation } = cardsData[this.page][this.idx];
    const front = this.elem.querySelector('.card-front');
    const back = this.elem.querySelector('.card-back');
    const cardTitleOriginal = this.elem.querySelector('.card-front .card-title');
    const cardTitleTranslated = this.elem.querySelector('.card-back .card-title');

    front.style.backgroundImage = `url(${config.assetsPath}${image})`;
    back.style.backgroundImage = `url(${config.assetsPath}${image})`;
    cardTitleOriginal.textContent = word;
    cardTitleTranslated.textContent = translation;
  }

  updateMode() {
    this.elem.classList.toggle('play', this.play);
  }

  stateEvents() {
    gameObserver.subscribe((data) => {
      if ('isPlay' in data) {
        this.play = data.isPlay;
        this.updateMode();
      }

      if ('gameReset' in data) {
        this.clearDone();
      }
    });
  }

  clearDone() {
    this.card.classList.remove('done');
  }

  events() {
    this.elem.addEventListener('click', ({ target }) => {
      if (target.classList.contains('rotate')) {
        this.card.classList.add('translate');
        this.card.parentNode.classList.add('target');
        this.isRotate = true;
        return;
      }

      if (!this.play) {
        game.playAudio(cardsData[this.page][this.idx].audioSrc);
      }

      if (this.card.classList.contains('done')) {
        return;
      }

      if (game.isPlay()) {
        const check = game.checkValue(this.idx);

        this.card.classList.toggle('done', check);
      }
    });

    this.elem.addEventListener('mouseleave', () => {
      if (this.isRotate) {
        this.card.classList.remove('translate');
        this.isRotate = false;

        setTimeout(() => {
          this.card.parentNode.classList.remove('target');
        }, 400);
      }
    });
  }
}
