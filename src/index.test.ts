import {describe, expect, test} from '@jest/globals';
import TextSplitter from './index'

describe('text split', () => {
  test('returns expected results', () => {
    let splitter = new TextSplitter(2, 1)
    let result = splitter.split("AB CD E ")
    expect(result).toEqual(["AB", " ", "CD", " E"]);
  });
});