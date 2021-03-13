import { config, categories, cardsData } from '../Constants/constants';
import CategoryCard from './CategoryCard';
import * as utils from '../Utils/utils';
import CardListing from '../Cards';

import './categoryCards.scss';

export default class CategoryListing {
  constructor() {
    this.imagePath = config.assetsPath;
    this.wrapper = document.querySelector('#main');
    this.cardsCategories = {};
    this.linkName = '#page_';
    this.page = 0;
    this.cardListing = utils.Listing(CardListing, this.page);
    this.cardListing.render();
  }

  update(page) {
    this.cardListing.update(page);
  }

  render() {
    let cardsCategories = null;

    const html = categories.map((item, idx) => {
      const { image } = cardsData[idx][0];
      return this.getChunk(image, item, idx);
    });

    this.wrapper.innerHTML = `
      <div class="container">
        <div class="flex flex_wrap align_inherit">
        ${html.join(' ')}
        </div>
      </div>
    `;

    cardsCategories = this.wrapper.querySelectorAll('.category-card');
    this.initCards(cardsCategories);
  }

  getChunk(image, title, idx) {
    return `
      <a href="${this.linkName}${idx + 1}" class="category-card">
        <img class="category-card__img" src="${this.imagePath}${image}" alt="${title}">
        <span class="category-card__title">${title}</span>
      </a>
    `;
  }

  initCards(cardsCategories) {
    cardsCategories.forEach((card, idx) => {
      this.cardsCategories[idx] = new CategoryCard(card, idx);
    });
  }
}
