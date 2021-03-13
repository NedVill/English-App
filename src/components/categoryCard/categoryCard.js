import { categories, sections } from '../Constants/constants';
import { pageObserver, gameObserver } from '../Observer';

export default class CategoryCard {
  constructor(item, idx) {
    this.item = item;
    this.idx = idx;
    this.linkName = '#page_';
    this.type = '';
    this.play = false;
    this.events();
    this.stateEvents();
  }

  stateEvents() {
    gameObserver.subscribe((data) => {
      if ('isPlay' in data) {
        this.play = data.isPlay;
        this.updateMode();
      }
    });
  }

  updateMode() {
    this.item.classList.toggle('play', this.play);
  }

  events() {
    this.item.addEventListener('click', (e) => {
      e.preventDefault();

      const currentPage = this.item.getAttribute('href').replace(this.linkName, '');
      const pageData = {
        pageTitle: categories[this.idx],
        currentSection: sections.inner,
        currentPage,
      };

      pageObserver.broadcast(pageData);
    });
  }
}
