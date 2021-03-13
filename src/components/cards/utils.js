const getChunk = (item, config) => {
  const chunk = `
    <div class="card-wrapper">
      <div class="card">
        <div class="card-skin card-front" style="background-image: url('${config.assetsPath}${item.image}');">
          <div class="card-bar flex al_center">
            <span class="card-title">${item.word}</span>
            <button class="rotate"></button>
          </div>
        </div>
        <div class="card-skin card-back" style="background-image: url('${config.assetsPath}${item.image}');">
          <div class="card-bar flex al_center">
            <span class="card-title">${item.translation}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  return chunk;
};

export default getChunk;
