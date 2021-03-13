export const observer = () => {
  const observers = [];

  const methods = {
    subscribe(func) {
      observers.push(func);
    },
    broadcast(data) {
      observers.forEach((sub) => sub(data));
    },
  };

  return methods;
};

export const Listing = (Category, page = '') => {
  const category = new Category(page);

  const methods = {
    render() {
      category.render();
    },
    update(currentPage) {
      category.update(currentPage);
    },
  };

  return methods;
};
