interface TextSplitterOptions {
  trimSentence?: boolean
  maxAllowedRowLength?: number
  maxNumberOfRows?: number
  fulfillEmptyRows?: boolean
}

interface Options {
  trimSentence: boolean
  maxAllowedRowLength: number
  maxNumberOfRows: number
  fulfillEmptyRows: boolean
}

export default class TextSplitter {
  options: Options;

  constructor(options: TextSplitterOptions) {
    this.options = {
      ...options,
      trimSentence: options.trimSentence ?? false,
      maxAllowedRowLength: options.maxAllowedRowLength ?? 100,
      maxNumberOfRows: options.maxNumberOfRows ?? 10,
      fulfillEmptyRows: options.fulfillEmptyRows ?? false
    };
  }

  split(text: string | null | undefined): string[] {
    if (!text && typeof text !== "string") {
      return [];
    }

    if (text.match(/^\s*$/g)) {
      return [text];
    }

    // trim the text at the edges
    if (this.options.trimSentence) {
      text = text.trim()
    }

    // decompose the sentence into words
    let words = []
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

    // split-up words that are longer than allowed length
    const splitUpTooLongWords = []
    for (const word of words) {
      if (word.length > this.options.maxAllowedRowLength) {
        const splitUpWord = (word
          .match(new RegExp('.{1,' + this.options.maxAllowedRowLength + '}', 'g')) ?? [])
          .map(line => line);

        for (const newWord of splitUpWord) {
          splitUpTooLongWords.push(newWord)
        }
      } else {
        splitUpTooLongWords.push(word)
      }
    }

    words = splitUpTooLongWords

    // use words to compose rows
    const rows: string[] = []
    let rowIndex = 0

    for (const word of words) {
      // decide whether to create new row
      const nextRowValue = (rows[rowIndex] ?? '') + word
      const nextRowValueDoesExceedMaxLength = nextRowValue.length > this.options.maxAllowedRowLength;
      if (nextRowValueDoesExceedMaxLength && rowIndex < this.options.maxNumberOfRows - 1) {
        rowIndex++
      }

      // add word into the current row
      rows[rowIndex] = (rows[rowIndex] ?? '') + word
    }

    if (!this.options.fulfillEmptyRows) {
      return [...rows]
    }

    const numberOfRowsToFulfill = this.options.maxNumberOfRows - rows.length
    const emptyRows: string[] = Array(numberOfRowsToFulfill).fill("")
    return [...rows, ...emptyRows]
  }
}