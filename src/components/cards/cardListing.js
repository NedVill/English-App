import getChunk from './utils';
import { config, cardsData } from '../Constants/constants';
import { gameObserver } from '../Observer';
import Card from './Card';
import game from '../Game';

import './cards.scss';

export default class CardListing {
  constructor(page) {
    this.section = document.querySelector('#inner');
    this.page = page;
    this.play = false;
    this.playButton = null;
    this.cardsItems = null;
    this.cardsObjects = {};
    this.stateEvents();
  }

  initCards() {
    this.cardsItems.forEach((item, idx) => {
      const card = new Card(item, idx);
      this.cardsObjects[idx] = card;
    });
  }

  stateEvents() {
    gameObserver.subscribe((data) => {
      if ('isPlay' in data) {
        this.play = data.isPlay;
        this.updateMode();
      }

      if ('gameReset' in data) {
        this.updateBehavior();
      }
    });
  }

  updateMode() {
    this.playButton.classList.toggle('active', this.play);
  }

  updateBehavior() {
    this.playButton.classList.remove('play');
  }

  update(page) {
    this.page = page;

    Object.keys(this.cardsObjects).forEach((item) => {
      this.cardsObjects[item].update(this.page);
    });
  }

  events() {
    this.playButton.addEventListener('click', () => {
      if (game.isPlay()) {
        game.repeatValue();
        return;
      }

      game.playGame(this.page - 1);

      this.playButton.classList.add('active');
      this.playButton.classList.add('play');
    });
  }

  render() {
    const html = cardsData[this.page].map((item) => getChunk(item, config));

    this.section.innerHTML = `
      <div class="container">
        <div class="flex flex_wrap align_inherit category-wrapper">
        ${html.join(' ')}
        </div>
        <button data-word="Play game!" class="button game-btn"></button>
      </div>
    `;

    this.cardsItems = document.querySelectorAll('.card-wrapper');
    this.playButton = document.querySelector('.game-btn');

    this.initCards();
    this.events();
  }
}
