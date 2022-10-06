const groupArrayToKeyboard = (array, groupSize) => {
  const keyboard = [];
  for (let i = 0; i < array.length; i += groupSize) {
    keyboard.push(array.slice(i, i + groupSize));
  }
  return keyboard;
}

module.exports = {
  groupArrayToKeyboard
}

