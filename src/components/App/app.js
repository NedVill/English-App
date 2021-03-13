import { gameObserver, pageObserver } from '../Observer';
import { pageTitles } from '../Constants/constants';
import * as utils from '../Utils/utils';
import CategoryListing from '../CategoryCard';
import CategoryNav from '../CategoryNav';
import game from '../Game';
import StatisticUi from '../StatisticUi';

export default class App {
  constructor() {
    this.currentSection = null;
    this.page = 0;
    this.play = false;
    this.pageTitle = pageTitles.main;
    this.pageTitleElem = document.querySelector('.header-title');
    this.modeButton = document.querySelector('.mode-btn__input');
    this.sections = document.querySelectorAll('.section');
    this.categoryListing = utils.Listing(CategoryListing);
    this.navCategories = utils.Listing(CategoryNav);
    this.results = utils.Listing(StatisticUi);
  }

  init() {
    this.categoryListing.render();
    this.navCategories.render();
    this.stateListener();
    this.events();
  }

  events() {
    this.modeButton.addEventListener('change', () => {
      this.play = this.modeButton.checked;
      gameObserver.broadcast({ isPlay: this.play });

      if (!this.play) {
        game.stopGame();
      }
    });
  }

  stateListener() {
    pageObserver.subscribe((datas) => {
      const { pageTitle, currentSection, currentPage } = datas;
      this.pageTitle = pageTitle;
      this.currentSection = currentSection;
      this.page = currentPage;

      if (+this.page !== 0 && !Number.isNaN(parseFloat(this.page))) {
        this.categoryListing.update(+this.page);
      }

      if (this.page === 'results') {
        this.results.render();
      }

      this.changePage();
      this.navCategories.update(this.page);
    });
  }

  changePage() {
    const currentSection = document.querySelector(`#${this.currentSection}`);
    this.pageTitleElem.textContent = this.pageTitle;

    this.sections.forEach((section) => {
      if (section.classList.contains('active')) {
        section.classList.remove('active');
      }
    });

    currentSection.classList.add('active');
  }
}
