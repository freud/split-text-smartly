export default class TextSplitter {
  maxAllowedLength: number;
  maxNumberOfRows: number;

  constructor(maxAllowedLength: number, maxNumberOfRows: number) {
    this.maxAllowedLength = maxAllowedLength;
    this.maxNumberOfRows = maxNumberOfRows;
  }

  split(text: string): string[] {
    if (!text) {
      return [text];
    }

    // trim the text at the edges
    text = text.trim()

    // decompose the sentence into words
    const words = []
    let wordBuffer = ''

    for (const char of text.normalize()) {
      const code = char.codePointAt(0)
      if (code === undefined) {
        continue
      }

      // ASCII control characters
      if (code <= 32) {
        words.push(wordBuffer)
        words.push(char)
        wordBuffer = ''
      } else {
        wordBuffer += char
      }
    }

    // add buffer if it exists
    // It's not added in case sentence has non-ASCII control characters at the end
    // It means new word detection did not happen yet at the end
    if (wordBuffer) {
      words.push(wordBuffer)
    }

    // use words to compose rows
    const rows: string[] = []
    let rowIndex = 0

    for (const word of words) {
      // decide whether to create new row
      const nextRowValue = (rows[rowIndex] ?? '') + word
      const nextRowValueDoesExceedMaxLength = nextRowValue.length > this.maxAllowedLength;
      if (nextRowValueDoesExceedMaxLength && rowIndex < this.maxNumberOfRows - 1) {
        rowIndex++
      }

      // add word into the current row
      rows[rowIndex] = (rows[rowIndex] ?? '') + word
    }

    return rows
  }
}

const splitter = new TextSplitter(3, 3)
const example1 = splitter.split("AB CD E F ")
const example2 = splitter.split("Paweł Sroczyński")

console.log(example1)
console.log(example2)
console.log("STOP")