# split-text-smartly [![NPM version](https://img.shields.io/npm/v/split-text-smartly.svg?style=flat-square)](https://www.npmjs.com/package/split-text-smartly) [![NPM total downloads](https://img.shields.io/npm/dt/split-text-smartly.svg?style=flat-square)](https://npmjs.org/package/split-text-smartly)

Smart way to split a text on white-space unless it's limited by the maximum allowed characters per line.

## Real scenario use cases
It's for the need of splitting up long text when fulfilling personal information forms with multiple first names, and last names like fields limited by the number of characters.

In other words given "name1", "name2", and "name3" form fields limited by 10 characters for each, and the "Jon Snow From Winterfell" name can be split up into `[ 'Jon Snow ', 'From ', 'Winterfell' ]` rows automatically.

Thanks to that form validation will improve a business process by taking off the need for human intervention.

## Example use cases

Default options:
- `trimSentence = false`
- `maxAllowedRowLength = 20`
- `maxNumberOfRows = 100`
- `fulfillEmptyRows = false`

Example text:
```
···Lorem·ipsum·dolor·sit·amet,·consectetur·adipiscingelit.···
```

### Option: `trimSentence`

Preserves all the characters without trimming them at the edge of lines, when `false`, like below.

Set `trimSentence = true`:
```js
[
  'Lorem·ipsum·dolor·', // spaces are trimmed at the start
  'sit·amet,·',
  'consectetur·',
  'adipiscing·elit.' // spaces are trimmed at the end
]
```

Set `trimSentence = false`:
```js
[
  '···Lorem·ipsum·dolor', // spaces are NOT trimmed at the start
  '·sit·amet,·',
  'consectetur·',
  'adipiscing elit.···' // spaces are NOT trimmed at the end
]
```

### Option: `maxAllowedRowLength`

Splits lines at the charaters length when there is no white-space.

Set `maxAllowedRowLength = 20`:
```js
[
  '···Lorem·ipsum·dolor',
  '·sit·amet,·',
  'consectetur·',
  'adipiscing elit.···'
]
```

Set `maxAllowedRowLength = 5`:
```js
[
  '···',   'Lorem', '·',
  'ipsum', '·',     'dolor',
  ' sit ', 'amet,', '·',
  'conse', 'ctetu', 'r·',
  'adipi', 'scing', '·',
  'elit.', '···'
]
```

### Option: `maxNumberOfRows`

Limits the number of rows after splitting a text and keeps the rest of text in the last line when text is limited by the number of lines.

`maxNumberOfRows = 3`:
```js
[
  '···Lorem·ipsum·dolor',
  '·sit·amet,·',
  'consectetur·adipiscing·elit.···' // more characters with the rest of text
]
```

`maxNumberOfRows = 2`:
```js
[
  '···Lorem·ipsum·dolor',
  '·sit·amet,·consectetur·adipiscing elit.···' // more characters with the rest of text
]
```

### Option: `fulfillEmptyRows`

Returns empty lines in case text is shorter than allowed number of lines after slpitting it.

Set `fulfillEmptyRows = true`:
```js
[
  '···Lorem·ipsum·dolor',
  ' sit·amet,·',
  'consectetur·',
  'adipiscing elit.···',
  '',
  '',
  '',
  '',
  '',
  ''
]
```

Set `fulfillEmptyRows = false`:
```js
[
  '···Lorem·ipsum·dolor',
  ' sit·amet,·',
  'consectetur·',
  'adipiscing elit.···'
]
```