// tslint:disable-next-line:no-var-requires
const csv = require('csv-parser');
import { plainToClass, classToPlain } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { getCsvKey } from './csvkey.decorator';

export interface ParsedData<T> {
  list: T[];
  total: number;
  count: number | null;
  offset: number | null;
  headers: string[] | null;
}

@Injectable()
export class CsvParser {
  async parse(stream, Entity, count: number = null, offset: number = null, csvConfig: object = {}): Promise<ParsedData<InstanceType<typeof Entity>>> {
    return new Promise((resolve, reject) => {
      let i = 0;
      let c = 0;
      const list = [];
      const errors = [];
      const headers = [];

      const pipedStream = stream.pipe(csv({
        strict: true,
        separator: ';',
        ...csvConfig,
      }));

      pipedStream.on('error', (e) => {
        errors.push(e);

        reject({ errors });
      });

      pipedStream.on('headers', hs => {
        hs.forEach(h => headers.push(h));
      });

      pipedStream.on('data', line => {
        i++;

        if (count) {
          if (c >= count) {
            return;
          }

          if (offset && (i - 1) < offset) {
            return;
          }

          c++;
        }

        list.push(this.processLine(line, Entity));
      });

      pipedStream.on(
        'end',
        () => errors.length > 0 ?
          reject({ errors })
          :
          resolve({
            list,
            count,
            offset,
            headers,
            total: i,
          }),
      );
    });
  }

  processLine(line: any, Entity): any {
    const entityInstance = new Entity();
    const plain = {};
    const plainLine = classToPlain(line);

    Object.keys(plainLine).forEach((key: string) => {
      const remapKey = getCsvKey(entityInstance, key);
      plain[remapKey || key] = plainLine[key];
    });

    return plainToClass(Entity, plain);
  }

}
