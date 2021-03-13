import Statistic from '../Statistic/StatisticClass';
import * as utils from './utils';

import './statistic.scss';

export default class StatisticUi extends Statistic {
  constructor() {
    super();
    this.rendered = false;
    this.visited = false;
    this.clearButton = null;
    this.tbody = null;
    this.sortTitles = null;
    this.activeSortElem = null;
    this.preparedStats = null;
    this.wrapper = document.querySelector('#results');
  }

  events() {
    this.sortTitles.forEach((item) => {
      item.addEventListener('click', () => {
        this.preparedStats = utils.getSort(item, this.preparedStats);
        this.rerender();
      });
    });

    this.clearButton.addEventListener('click', () => {
      this.resetLocalData();
      this.prepareData();
      this.rerender();
    });
  }

  prepareData() {
    const categories = Object.keys(this.currentStats);
    let currentData = {};

    currentData = categories.reduce((acc, category) => {
      const words = Object.keys(this.currentStats[category]);
      const mainObject = words.reduce((wordAcc, word) => {
        const wordObject = {};
        wordObject[word] = { ...this.currentStats[category][word] };
        wordObject[word].category = category;
        return { ...wordAcc, ...wordObject };
      }, {});

      return { ...acc, ...mainObject };
    }, {});

    currentData = utils.sortObject(currentData, 'mistakes');
    this.preparedStats = { ...currentData };
  }

  render() {
    if (!this.rendered) {
      this.prepareData();
    }

    if (this.visited) {
      this.updateData();
      this.prepareData();
      this.rerender();
    }

    this.doRender();
    this.rendered = true;
    this.visited = true;
    this.tbody = document.querySelector('.result-table tbody');
    this.sortTitles = document.querySelectorAll('[data-sort]');
    this.clearButton = document.querySelector('.result-clear');
    this.events();
  }

  doRender() {
    const trs = this.renderRows();

    this.wrapper.innerHTML = `
      <div class="container">
        <div class="flex result-bar">
          <button class="button result-clear">Clear</button>
        </div>
        <div class="result-wrapper">
          <p><i>You can filter values</i></p>
          <table class="result-table">
              <caption class="result-table__caption">Results</caption>
              <thead class="result-table__thead">
                  <td class="result-table__td result-table__sort"><span data-sort class="result-table__title">Word</span></td>
                  <td class="result-table__td result-table__sort"><span data-sort class="result-table__title">Translation</span></td>
                  <td class="result-table__td result-table__sort"><span data-sort class="result-table__title">Category</span></td>
                  <td class="result-table__td result-table__sort"><span data-sort class="result-table__title">Clicks</span></td>
                  <td class="result-table__td result-table__sort"><span data-sort class="result-table__title">Success</span></td>
                  <td class="result-table__td result-table__sort"><span data-sort class="result-table__title">Mistakes</span></td>
                  <td class="result-table__td result-table__sort"><span data-sort class="result-table__title">Errors</span></td>
              </thead>
              <tbody>
              ${trs.join(' ')}
              </tbody>
          </table>
        </div>
    </div>
    `;
  }

  rerender() {
    const trs = this.renderRows();
    this.tbody.innerHTML = `${trs.join(' ')}`;
  }

  renderRows() {
    const words = Object.keys(this.preparedStats);
    const trs = words.map((word) => this.getChunk(word));

    return trs;
  }

  getChunk(word) {
    return `
      <tr class="result-table__tr">
        <td class="result-table__td">${this.preparedStats[word].word}</td>
        <td class="result-table__td">${this.preparedStats[word].translation}</td>
        <td class="result-table__td">${this.preparedStats[word].category}</td>
        <td class="result-table__td">${this.preparedStats[word].clicks}</td>
        <td class="result-table__td">${this.preparedStats[word].success}</td>
        <td class="result-table__td">${this.preparedStats[word].mistakes}</td>
        <td class="result-table__td">${this.preparedStats[word].errors}%</td>
      </tr>
    `;
  }
}
