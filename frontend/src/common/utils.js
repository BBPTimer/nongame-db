// https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const resetDeck = () => {
  localStorage.setItem("deck", "All Ages (Deep)");
};

const readFormData = (event) => {
  const form = event.target;
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());
  return formJson;
};

export { shuffle, resetDeck, readFormData };
