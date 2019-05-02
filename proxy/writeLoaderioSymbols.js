const fs = require('fs');


const writeLoaderioSymbols = fs.createWriteStream('./loaderioSymbols.json');

const alphabet = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
const symbols = [];
const generateSymbols = () => {
  let word = '';
  for (let firstChar = 0; firstChar < 26; firstChar += 1) {
    for (let secondChar = 0; secondChar < 26; secondChar += 1) {
      for (let thirdChar = 0; thirdChar < 26; thirdChar += 1) {
        for (let fourthChar = 0; fourthChar < 26; fourthChar += 1) {
          for (let fifthChar = 0; fifthChar < 26; fifthChar += 1) {
            word = alphabet[firstChar] + alphabet[secondChar] + alphabet[thirdChar]
            + alphabet[fourthChar] + alphabet[fifthChar];
            symbols.push(word);
          }
        }
      }
    }
  }
};
generateSymbols();

const loaderioSymbolsObj = {
  "keys": ["SYMBOL"],
  "values": [],
}

for (let i = 4995000; i < 5005000; i += 1) {
  loaderioSymbolsObj.values.push([symbols[i]]);
}

writeLoaderioSymbols.write(JSON.stringify(loaderioSymbolsObj));
