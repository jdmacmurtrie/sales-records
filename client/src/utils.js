export const titleCase = str => {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
};

export const calculateTransactionTotal = data => {
  let total = 0;
  data.forEach(dataLine => {
    if (dataLine.TXN_TYPE === "BUY") {
      total += dataLine.transactionTotal;
    } else {
      total -= dataLine.transactionTotal;
    }
  });
  return total;
};
