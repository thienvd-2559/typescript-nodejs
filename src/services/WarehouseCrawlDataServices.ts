import puppeteer from 'puppeteer';
import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { DETAIL_PAGE_WARE_HOUSE_CONFIG, CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG } from '../config/WarehouseCrawlDataConfig';

async function WarehouseCrawlDataServices() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.on('request', (req) => {
      const typeImageVideo = ['image', 'media'];
      const videoExtension = ['.mp4', '.avi', '.flv', '.mov', '.wmv'];
      const url = req.url().toLowerCase();
      const resourceType = req.resourceType();
      const splitStringVideo = url.split('.');
      // total '.' appear in a string
      const total = splitStringVideo.length - 1;
      // show last string
      const videoTail = splitStringVideo[total];
      if (
        videoExtension.includes(videoTail) === true ||
        typeImageVideo.includes(resourceType) === true
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
    winston.info('Redirecting to page.on(\'request\')');

    await page.goto('https://www.cbre-propertysearch.jp/industrial/', {
      waitUntil: 'load',
      timeout: 30000,
    });
    winston.info('Redirecting to [\'https://www.cbre-propertysearch.jp/industrial/\']');

    await page.content();
    winston.info('Redirecting to page.content');

    return await page.evaluate(() => {
      const domain = [];
      document
        .querySelectorAll(
          '#contents > div.topArea > div.section.areas > div > div >.group'
        )
        .forEach((e) => {
          const city = [];
          e.querySelectorAll('ul>li').forEach((el) => {
            // @ts-ignore
            city.push(el.innerText);
          });
          domain.push({
            domain: e.querySelector('p').innerHTML,
            city,
          });
        });
      return domain;
    });
  } catch (error) {
    winston.info(error);
  }
}

async function detailPageWarehouseServices(url) {
  try {
    const options = {
      method: 'GET',
      uri: `https://www.cbre-propertysearch.jp/industrial/${url}`,
    };
    const result = await request_promise(options);
    winston.info(result);
    const $ = cheerio.load(result);
    const dataWarehouse = [];
    $(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM).each(function (e) {
      dataWarehouse.push({
        倉庫名: $(this).find(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM_WAREHOUSE).text(),
        所在地: $(this).find(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM_LOCATION).text(),
        交通: $(this).find(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM_TRAFFIC).text(),
        規模: $(this).find(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM_SCALE).text(),
        竣工: $(this).find(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM_COMPLETION).text(),
      });
    });

    return dataWarehouse;
  } catch (error) {
    winston.info(error);
  }
}


async function crawlDetailPageWareTokyoServices() {
  try {
    const dataPageWareTokyo = [];
    const options = {
      method: 'GET',
      uri: 'https://www.cbre-propertysearch.jp/industrial/tokyo/',
    };
    const result = await request_promise(options);
    winston.info('result');
    const $ = cheerio.load(result);
    const dataWarehouse = [];
    $(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM).each(function (e) {
      dataWarehouse.push(
        $(this).find(DETAIL_PAGE_WARE_HOUSE_CONFIG.DOM_WAREHOUSE).attr('href'),
      );
    });
    winston.info('dataWarehouse');

    for(let i = 0; i < dataWarehouse.length; i++) {
      const start = Date.now();
      const optionsTokyo = {
        method: 'GET',
        uri: `https://www.cbre-propertysearch.jp${dataWarehouse[i]}`,
      };
      winston.info('optionsTokyo');
      const resultTokyo = await request_promise(optionsTokyo);
      winston.info('resultHokkaido');
      const $2 = cheerio.load(resultTokyo);
      const normalizeText = (text) => {
        return text.replace(/\\n/g, '').trim();
      };
      $2(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM).each(function (e) {
        dataPageWareTokyo.push({
          '画像_1': $2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_IMAGE_1).attr('data-src'),
          '画像_2': $2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_IMAGE_2).attr('data-src'),
          '物件名': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_PROPERTY_NAME).text()),
          '所在地': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_LOCATION).text()),
          '交通': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_TRAFFIC).text()),
          '用途地域': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_USE_DISTRICT).text()),
          '建蔽率 / 容積率'	: normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_BUILDING_COVERAGE_RATIO_FLOOR_AREA_RATIO).text()),
          '竣工年月'	: normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_DATE_OF_COMPLETION).text()),
          '規模': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_SCALE).text()),
          '構造': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_CONSTRUCTION).text()),
          '延床面積': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_TOTAL_FLOOR_AREA).text()),
          '昇降機': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ELEVATOR).text()),
          '天井高備考': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_CEILING_HEIGHT_REMARKS).text()),
          '床荷重': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_FLOOR_LOAD).text()),
          '１階床形式': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_1ST_FLOOR_TYPE).text()),
          '床形式備考': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_FLOOR_TYPE_REMARKS).text()),
          '冷蔵冷凍設備': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_REFRIGERATING_AND_FREEZING_EQUIPMENT).text()),
          '建物備考': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_BUILDING_REMARKS).text()),
          'icon': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ICON).text()),
          'icon2': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ICON2).text()),
          'icon3': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ICON3).text()),
          'icon4': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ICON4).text()),
          'icon5': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ICON5).text()),
          'icon6': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ICON6).text()),
          'icon7': normalizeText($2(this).find(CRAWL_DETAIL_PAGE_WARE_TOKYO_CONFIG.DOM_ICON7).text()),
        });
        const dateTimeRequest = (Date.now() - start)/1000;
        winston.info({
          'Request' : i + 1,
          'Request time': dateTimeRequest,
        });
      });
      winston.info('dataPageWareTokyo');
    }
    return dataPageWareTokyo;
  } catch (error) {
    winston.info(error);
  }
}

export { WarehouseCrawlDataServices, detailPageWarehouseServices, crawlDetailPageWareTokyoServices };
