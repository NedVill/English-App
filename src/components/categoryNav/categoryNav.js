import { pageObserver } from '../Observer';
import { categories, sections, pageTitles } from '../Constants/constants';
import game from '../Game';

export default class CategoryNav {
  constructor() {
    this.nav = document.querySelector('.header-nav');
    this.burger = document.querySelector('.burger-input');
    this.navsCategories = null;
    this.navsCategoryActive = null;
    this.linkName = '#page_';
  }

  events() {
    document.addEventListener('click', ({ target }) => {
      const { checked } = this.burger;

      if (!target.closest('.header') && checked) {
        this.burger.checked = false;
      }

      return false;
    });

    this.navsCategories.forEach((item, idx) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const currentPage = item.getAttribute('href').replace(this.linkName, '');

        let currentSection;
        let pageTitle;

        if (currentPage === '0') {
          pageTitle = pageTitles.main;
          currentSection = sections.main;
        }

        if (currentPage === pageTitles.results.toLowerCase()) {
          pageTitle = pageTitles.results;
          currentSection = sections.results;
        }

        if (currentPage !== '0' && currentPage !== pageTitles.results.toLowerCase()) {
          pageTitle = categories[idx - 1];
          currentSection = sections.inner;
        }

        pageObserver.broadcast({ pageTitle, currentSection, currentPage });
        game.stopGame();
      });
    });
  }

  updateActive(item) {
    this.navsCategoryActive.classList.remove('active');
    item.classList.add('active');
    this.navsCategoryActive = item;
    this.burger.checked = false;
  }

  update(page) {
    this.navsCategories.forEach((item) => {
      const currentPage = item.getAttribute('href').replace(this.linkName, '');

      if (currentPage === page) {
        this.updateActive(item);
      }
    });
  }

  render() {
    const html = categories.map((item, idx) => `<li class="header-nav__item"><a class="header-nav__link" href="#page_${idx + 1}">${item}</a></li>`);

    this.nav.innerHTML = `
      <ul>
        <li class="header-nav__item"><a class="header-nav__link active" href="#page_0">Main Page</a></li>
        ${html.join(' ')}
        <li class="header-nav__item"><a class="header-nav__link" href="#page_results">Results</a></li>
      </ul>
    `;

    this.navsCategories = this.nav.querySelectorAll('.header-nav__link');
    this.navsCategoryActive = this.nav.querySelector('.active');

    this.events();
  }
}
