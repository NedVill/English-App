import * as utils from './utils';
import { cardsData, categories } from '../Constants/constants';

export default class Statistic {
  constructor() {
    this.currentStats = null;
    this.templateStats = {
      word: null,
      translation: null,
      category: null,
      clicks: 0,
      mistakes: 0,
      success: 0,
      errors: 0,
    };
    this.set();
  }

  set() {
    if (utils.getStorage('statistic')) {
      this.currentStats = utils.getStorage('statistic');
      return;
    }

    this.currentStats = {};
    this.buildData();
  }

  resetLocalData() {
    utils.deleteStorage();
    this.set();
  }

  buildData() {
    categories.forEach((category, idx) => {
      this.currentStats[category] = {};

      cardsData[idx].forEach((item) => {
        const { word } = item;
        this.currentStats[category][word] = { ...this.templateStats };
        this.currentStats[category][word].word = word;
        this.currentStats[category][word].translation = item.translation;
      });
    });
  }

  updateData() {
    const storage = utils.getStorage('statistic');
    this.currentStats = {};

    if (!storage) {
      this.buildData();
    } else {
      this.currentStats = storage;
    }
  }

  save(category, object) {
    this.currentStats[category] = { ...object };
    this.calculateErrors(category);
    utils.saveStorage('statistic', this.currentStats);
  }

  calculateErrors(category) {
    Object.keys(this.currentStats[category]).forEach((item) => {
      const errors = this.currentStats[category][item].mistakes;
      const length = this.currentStats[category][item].clicks;
      this.currentStats[category][item].errors = parseFloat(((errors * 100) / length).toFixed(2));
    });
  }

  get(category) {
    return this.currentStats[category];
  }
}
