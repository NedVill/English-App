import Statistic from '../Statistic';
import { gameObserver, pageObserver } from '../Observer';
import * as utils from './utils';
import {
  config,
  cardsData,
  sections,
  categories,
} from '../Constants/constants';
import { elems, templates } from './constants';

import './game.scss';

export default class Game {
  constructor() {
    this.play = false;
    this.page = 0;
    this.gameData = [];
    this.word = null;
    this.category = null;
    this.stats = null;
    this.currentStats = null;
    this.falls = 0;
    this.audioElement = new Audio();
  }

  isPlay() {
    return this.play;
  }

  checkValue(idx) {
    let check = false;

    this.currentStats[this.word].clicks += 1;

    if (idx === +this.gameData[0]) {
      this.setDone();
      const finish = this.checkFinish();
      check = !finish;
    } else {
      this.playAudio(config.errorSound);
      this.setFall();
    }

    return check;
  }

  setPlay() {
    this.play = true;
  }

  setFall() {
    this.falls += 1;
    this.currentStats[this.word].mistakes += 1;
    elems.gameStars.innerHTML = `${elems.gameStars.innerHTML}${templates.fallStar}`;
  }

  setDone() {
    this.currentStats[this.word].success += 1;
    this.nextItem();
    elems.gameStars.innerHTML = `${elems.gameStars.innerHTML}${templates.doneStar}`;
  }

  checkFinish() {
    let well = true;

    if (this.gameData.length > 0) {
      this.playAudio(config.succesSound);

      setTimeout(() => {
        this.repeatValue();
      }, 1000);

      well = false;
    } else {
      this.setFinish();
    }

    return well;
  }

  setFinish() {
    let pageData = {
      pageTitle: null,
      currentSection: sections.finish,
      numberOfPage: 0,
    };

    pageObserver.broadcast(pageData);
    gameObserver.broadcast({ gameReset: true });

    if (this.falls > 0) {
      elems.finishImage.setAttribute('src', `${config.assetsPath}${config.sadImage}`);
      elems.finishTitle.textContent = `Errors: ${this.falls}`;
      elems.finish.classList.add('finish-loose');

      this.playAudio(config.looseSound);
    } else {
      elems.finishImage.setAttribute('src', `${config.assetsPath}${config.succesImage}`);
      elems.finishTitle.textContent = 'Congratulations! You win!';
      elems.finish.classList.add('finish-wind');

      this.playAudio(config.winSound);
    }

    this.stats.save(this.category, this.currentStats);

    setTimeout(() => {
      this.stopGame();

      pageData = {
        pageTitle: 'Main page',
        currentSection: sections.main,
        numberOfPage: 0,
      };

      pageObserver.broadcast(pageData);
    }, 2000);
  }

  checkContinue() {
    return this.gameData.length > 0;
  }

  playAudio(name) {
    this.audioElement.pause();
    this.audioElement.src = `${config.assetsPath}${name}`;
    this.audioElement.play();
  }

  playGame(page) {
    this.page = page;

    const pageData = Object.keys(cardsData[page]);

    this.gameData = utils.setRandData(pageData, []);

    const wordData = cardsData[this.page][this.gameData[0]];

    this.word = wordData.word;
    this.category = categories[this.page];
    this.stats = new Statistic();
    this.play = true;
    this.currentStats = { ...this.stats.get(this.category) };
    this.playAudio(`${wordData.audioSrc}`);
  }

  stopGame() {
    this.gameData = [];
    this.play = false;
    elems.gameStars.innerHTML = '';
    this.falls = 0;
    gameObserver.broadcast({ gameReset: true });
  }

  nextItem() {
    this.gameData.shift();
    const wordData = cardsData[this.page][this.gameData[0]];
    this.word = null;

    if (this.gameData.length > 0) {
      this.word = wordData.word;
    }
  }

  repeatValue() {
    const wordData = cardsData[this.page][this.gameData[0]];

    if (wordData) {
      this.playAudio(`${wordData.audioSrc}`);
    }
  }
}
