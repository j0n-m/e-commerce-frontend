export default function upperFirstLetters(str: string) {
  let words = str.split(" ");
  words = words.map((word) => {
    const newWord = word.toLowerCase();
    return newWord[0].toUpperCase() + newWord.slice(1);
  });
  return words.join(" ");
}
