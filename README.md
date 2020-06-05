# CSV Parser for NestJS

[Nest](https://github.com/nestjs/nest) framework library.

Wrapper for [csv-parser library](https://github.com/mafintosh/csv-parser)

This project is a fork of the original [nest-csv-parser](https://github.com/mCzolko/nest-csv-parser).

Additions in this version:
* The ability to inspect the headers that were parsed (via the `ParsedData.headers` field)

## Installation

```bash
$ npm install @jynnantonnyx/nest-csv-parser
# or if you using Yarn
$ yarn add @jynnantonnyx/nest-csv-parser
```

Add `@jynnantonnyx/nest-csv-parser` as a dependency.

```js
import { Module } from '@nestjs/common'
import { CsvModule } from '@jynnantonnyx/nest-csv-parser'
// ...imports of your app dependecies

@Module({
  imports: [
    CsvModule, // <-- add into imports
    ...
  ],
  controllers: [ ... ],
  providers: [ ... ]
})
export class AppModule {}
```

## Usage

Parser will create instance of entity for each line in CSV stream.

```js
// app.parser.ts
import { Injectable } from '@nestjs/common'
import { CsvParser } from '@jynnantonnyx/nest-csv-parser'

class Entity {
  foo: string
  bar: string
}

@Injectable()
export class AppService {
  constructor(
    private readonly csvParser: CsvParser
  ) {}

  async parse() {
    // Create stream from file (or get it from S3)
    const stream = fs.createReadStream(__dirname + '/some.csv');
    const data: ParsedData<Entitiy> data = await csvParser.parse(stream, Entity);
    const entities: Entity[] = data.list;

    // Inspect headers
    const headers: string[] = data.headers;

    return entities;
  }
}
```

## API

`csvParser.parse(stream, Entity, count, offset, csvConfig)` has 5 parameters.

### stream

required

First parameter has to be the stream of the CSV file. [NodeJS Reference](https://nodejs.org/api/stream.html)

### Entity

required

Has to be object from which will parser create instance.

### count (optional)

default: null

How many lines you want to parse.

### offset (optional)

default: null

Offset is similar to SQL databases. Skips the N lines from the beginning of the file.

### csvConfig (optional)

default

```js
{ strict: true, separator: ';' }
```

Just a configuration object  for [csv-parser library](https://github.com/mafintosh/csv-parser) options you can find [here](https://github.com/mafintosh/csv-parser#api)

## Development

```bash
# clone repository
$ git clone git@github.com:jynnantonnyx/nest-csv-parser.git
$ cd nest-csv-parser

# install dependencies
$ npm install

# watch mode
$ npm test:watch
```

## Test

```bash
# unit tests
$ npm test
```
