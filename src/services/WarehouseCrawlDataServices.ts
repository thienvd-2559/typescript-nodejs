import puppeteer from 'puppeteer';
import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { urlProvince, listProvince, listStore } from '../config/WarehouseCrawlDataConfig';
import { normalizeText } from '../utils/string';

async function warehouseCrawlData() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    winston.info('Redirecting to page.on("request")');
    await page.on('request', (req) => {
      const typeImageVideo = ['image', 'media'];
      const videoExtension = ['.mp4', '.avi', '.flv', '.mov', '.wmv'];
      const url = req.url().toLowerCase();
      const resourceType = req.resourceType();
      const splitUrlByDot = url.split('.');
      // total '.' appear in a string
      const urlExtension = splitUrlByDot.length - 1;
      // show last string
      const videoTail = splitUrlByDot[urlExtension];
      if (videoExtension.includes(videoTail) === true || typeImageVideo.includes(resourceType) === true) {
        req.abort();
      } else {
        req.continue();
      }
    });

    winston.info(`Redirecting to [${urlProvince}]`);
    await page.goto(`${urlProvince}`, {
      waitUntil: 'load',
      timeout: 30000,
    });

    winston.info('Redirecting to page.content');
    await page.content();

    return await page.evaluate(() => {
      const domain = [];
      document.querySelectorAll('#contents > div.topArea > div.section.areas > div > div >.group').forEach((e) => {
        const City = [];
        e.querySelectorAll('ul > li').forEach((el) => {
          // @ts-ignore
          City.push(el.innerText);
        });
        domain.push({
          Domain: e.querySelector('p').innerHTML,
          City,
        });
      });
      return domain;
    });
  } catch (error) {
    winston.info(error);
  }
}

async function detailPageWarehouse(url) {
  try {
    const options = {
      method: 'GET',
      uri: `${urlProvince}${url}`,
    };
    winston.info(options.uri);
    const result = await request_promise(options);
    winston.info('result');
    const symbol = cheerio.load(result);
    const dataWarehouse = [];
    symbol(listProvince.dom_item_city).each(function () {
      const dataPageData = {};
      // tslint:disable-next-line: no-string-literal
      dataPageData['城舗'] = symbol(this).find(listProvince.dom_city).text();
      symbol(this)
        .find(listProvince.dom_other_information)
        .each(function () {
          dataPageData[symbol(this).find('th').text()] = symbol(this).find('td').text();
        });
      dataWarehouse.push(dataPageData);
    });
    return dataWarehouse;
  } catch (error) {
    winston.info(error);
  }
}

async function detailPageProvince() {
  try {
    const dataPageWare = [];
    const options = {
      method: 'GET',
      uri: `${urlProvince}tokyo/`,
    };
    const result = await request_promise(options);
    winston.info('result');
    const symbol = cheerio.load(result);
    const dataWarehouse = [];
    symbol(listProvince.dom_province).each(function (e) {
      dataWarehouse.push(symbol(this).find(listProvince.dom_warehouse).attr('href'));
    });
    winston.info('dataWarehouse');

    for (let i = 0; i < dataWarehouse.length; i++) {
      const start = Date.now();
      const optionsTokyo = {
        method: 'GET',
        uri: `https://www.cbre-propertysearch.jp${dataWarehouse[i]}`,
      };
      winston.info('optionsTokyo');
      const resultTokyo = await request_promise(optionsTokyo);
      winston.info('resultTokyo');
      const operator = cheerio.load(resultTokyo);
      let dataPage = {};
      const dataImage = [];
      operator(listStore.dom_image).each(function () {
        dataImage.push(operator(this).find('img').attr('data-src'));
      });
      dataPage = Object.assign({}, dataImage);
      operator(listStore.dom_table).each(function () {
        dataPage[normalizeText(operator(this).find('th').text())] = normalizeText(operator(this).find('td').text());
      });
      // winston.info(data);
      dataPageWare.push(dataPage);
      const dateTimeRequest = (Date.now() - start) / 1000;
      winston.info({
        Request: i + 1,
        'Request time': dateTimeRequest,
      });

      winston.info('dataPageWare');
    }
    return dataPageWare;
  } catch (error) {
    winston.info(error);
  }
}

export { warehouseCrawlData, detailPageWarehouse, detailPageProvince };
