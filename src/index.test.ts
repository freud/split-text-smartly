import { describe, expect, test } from '@jest/globals';
import TextSplitter from './index'

describe('TextSplitter', () => {
  describe('Given empty text', () => {
    describe('When splitting', () => {
      const useCases = [
        { text: "", maxAllowedRowLength: 2, expectedResults: [""] },
        { text: "   ", maxAllowedLength: 4, expectedResults: ["   "] },
        { text: "\t", maxAllowedLength: 100, expectedResults: ["\t"] },
        { text: null, maxAllowedLength: 1, expectedResults: [] },
        { text: undefined, maxAllowedLength: 1, expectedResults: [] }
      ];
      it.each(useCases)(
        `returns the same empty text (%p)`,
        (({ text, maxAllowedRowLength, expectedResults }) => {
          const normalizer = new TextSplitter({
            maxAllowedRowLength: maxAllowedRowLength,
            maxNumberOfRows: 1000
          });
          const result = normalizer.split(text);
          expect(result).toEqual(expectedResults);
        })
      )
    })
  })


  describe('Given whitespaces at start or end', () => {
    const useCases = [
      { text: "   abc  ", maxAllowedLength: 2, expectedResults: ["ab", "c"] },
      { text: "   abc  ", maxAllowedLength: 200, expectedResults: ["abc"] },
      { text: "   abc  ", maxAllowedLength: 4, expectedResults: ["abc"] },
      { text: "   abcd  ", maxAllowedLength: 3, expectedResults: ["abc", "d"] },
      { text: "   abc d  ", maxAllowedLength: 3, expectedResults: ["abc", " d"] }
    ];

    describe('When splitting with trim option', () => {
      it.each(useCases)(
        `returns trimmed text (%p)`,
        (({ text, maxAllowedLength, expectedResults }) => {
          const normalizer = new TextSplitter({
            trimSentence: true,
            maxAllowedRowLength: maxAllowedLength,
            maxNumberOfRows: 1000
          });
          const result = normalizer.split(text);
          expect(result).toEqual(expectedResults);
        })
      )
    })

    describe('When splitting without trim option', () => {
      const useCases = [
        { text: "   abc  ", maxAllowedLength: 2, expectedResults: ["  ", " ", "ab", "c ", " "] },
        { text: "   abc  ", maxAllowedLength: 200, expectedResults: ["   abc  "] },
        { text: "   abc  ", maxAllowedLength: 4, expectedResults: ["   ", "abc ", " "] },
        { text: "   abcd  ", maxAllowedLength: 3, expectedResults: ["   ", "abc", "d  "] },
        { text: "   abc d  ", maxAllowedLength: 3, expectedResults: ["   ", "abc", " d ", " "] }
      ];

      it.each(useCases)(
        `returns trimmed text (%p)`,
        (({ text, maxAllowedLength, expectedResults }) => {
          const normalizer = new TextSplitter({
            trimSentence: false,
            maxAllowedRowLength: maxAllowedLength,
            maxNumberOfRows: 1000
          });
          const result = normalizer.split(text);
          expect(result).toEqual(expectedResults);
        })
      )
    })
  });

  describe('Given text with NOT exceeded length', () => {
    describe('When splitting', () => {
      const text = ["abc", "abc def ghi"];
      it.each(text)(
        `returns the same empty text (%p)`,
        (text => {
          let allowedLengthDoesNotLimitingText = 100;
          const normalizer = new TextSplitter({
            trimSentence: true,
            maxAllowedRowLength: allowedLengthDoesNotLimitingText,
            maxNumberOfRows: 1000
          });
          const result = normalizer.split(text);
          expect(result).toEqual([text]);
        })
      )
    })
  });

  describe('Given text with exceeded length (longer than allowed max characters)', () => {
    describe('When splitting', () => {
      const useCases = [
        { text: "abc def", maxAllowedLength: 2, expectedResults: ["ab", "c ", "de", "f"] },
        { text: "abc def", maxAllowedLength: 4, expectedResults: ["abc ", "def"] },
        { text: "abc def", maxAllowedLength: 1, expectedResults: ["a", "b", "c", " ", "d", "e", "f"] }
      ];
      it.each(useCases)(
        `returns expected text results (%p)`,
        (({ text, maxAllowedLength, expectedResults }) => {
          const normalizer = new TextSplitter({
            trimSentence: true,
            maxAllowedRowLength: maxAllowedLength,
            maxNumberOfRows: 1000
          });
          const result = normalizer.split(text);
          expect(result).toEqual(expectedResults);
        })
      )

      const useCasesWithDifferentCharacters = [
        { text: "a b c d ", maxAllowedLength: 2, expectedResults: ["a ", "b ", "c ", "d"] },
        { text: " a b c d ", maxAllowedLength: 2, expectedResults: ["a ", "b ", "c ", "d"] },
        { text: "  a  b  c  d  ", maxAllowedLength: 2, expectedResults: ["a ", " b", "  ", "c ", " d"] },
        { text: "abcd", maxAllowedLength: 2, expectedResults: ["ab", "cd"] },
        { text: "A ¶¶ ", maxAllowedLength: 2, expectedResults: ["A ", "¶¶"] },
        { text: "A ¶\t¶ ", maxAllowedLength: 2, expectedResults: ["A ", "¶\t", "¶"] }
      ];
      it.each(useCasesWithDifferentCharacters)(
        `returns text results with preserved (not removed) characters (%p)`,
        (({ text, maxAllowedLength, expectedResults }) => {
          const normalizer = new TextSplitter({
            trimSentence: true,
            maxAllowedRowLength: maxAllowedLength,
            maxNumberOfRows: 1000
          });
          const result = normalizer.split(text);
          expect(result).toEqual(expectedResults);
        })
      )
    })
  });

})