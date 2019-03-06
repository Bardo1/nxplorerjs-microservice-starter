import { Observable, from } from 'rxjs';
import * as scrapeIt from 'scrape-it';
import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import ILogger from '../../common/interfaces/ilogger';
import IScraper from '../interfaces/iscraper';

const amazonConfig = {
  title: '#productTitle',
  salePrice: 'tr#priceblock_ourprice_row td.a-span12 span#priceblock_ourprice',
  salePriceDesc: 'tr#priceblock_ourprice_row span.a-size-small.a-color-price',
  mrpPrice: 'div#price span.a-text-strike',
  savings: 'tr#regularprice_savings td.a-span12.a-color-price.a-size-base',
  brand: 'div#bylineInfo_feature_div a#bylineInfo',
  vat: 'tr#vatMessage',
  availiability: 'div#availability',
  vnv: 'div#vnv-container',
  features: {
    listItem: 'div#feature-bullets ul li',
    name: 'features',
    data: {
      feature: 'span.a-list-item'
    }
  },
  brandUrl: {
    selector: 'div#bylineInfo_feature_div a#bylineInfo',
    attr: 'href'
  },

  image: {
    selector: 'img#landingImage',
    attr: 'src'
  }
};

const defaultConfig = amazonConfig;
/**
 * Starwars Service Implementation
 */
@injectable()
class ScraperService implements IScraper {
  public loggerService: ILogger;
  public constructor(
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
  ) {
    this.loggerService = loggerService;
  }

  public getScrapedData = (url: string): Observable<any> => {
    return from(
      new Promise((resolve, reject) =>
        scrapeIt(url, this.getConfiguration(url)).then(
          ({ data, response }) => {
            resolve(data);
          },
          error => {
            this.loggerService.error(error);
          }
        )
      )
    );
  };

  private getConfiguration = (url: string) => {
    if (url.toUpperCase().includes('AMAZON')) {
      return amazonConfig;
    } else {
      return defaultConfig;
    }
  };
}

export default ScraperService;
