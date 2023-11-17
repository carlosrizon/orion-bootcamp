import moment from 'moment';
import md5 from 'md5';
import 'dotenv/config';

// métodos de definição de parâmetros para get API Marvel

export default class MarvelParamsDefinition {
  *offsetter() {
    let value = 0;
    while (true) {
      yield value;
      value += this.maxMarvelAPILimit();
    }
  }

  getTimestamp(): number {
    return Date.now();
  }

  baseURL(): string {
    return process.env.MARVEL_URL_BASE;
  }

  apikey(): string {
    return process.env.MARVEL_API_KEY;
  }

  maxMarvelAPILimit(): number {
    return 100;
  }

  modifiedsSince(daysInterval): string {
    const today = moment();
    const daysAgoString: string = today
      .subtract(daysInterval, 'days')
      .format('YYYY-MM-DD');
    return daysAgoString;
  }

  hashGenarator(timestamp: number): string {
    return md5(
      timestamp + process.env.MARVEL_PRIVATE_KEY + process.env.MARVEL_API_KEY
    );
  }
}
