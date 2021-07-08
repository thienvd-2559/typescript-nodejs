import puppeteer from 'puppeteer';
import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { detailPageWarehouseConfig } from '../config/WarehouseCrawlDataConfig';

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
      // total '.' appear in a string
      const total = url.split('.').length - 1;
      // show last string
      const videoTail = url.split('\'')[total];
      if ( videoExtension.includes(videoTail) === true || typeImageVideo.includes(resourceType) === true) {
        req.abort();
      } else {
        req.continue();
      }
    });
    winston.info(page);

    await page.goto('https://www.cbre-propertysearch.jp/industrial/', {
      waitUntil: 'load',
      timeout: 30000,
    });
    winston.info(page);

    await page.content();
    winston.info(await page.content())

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
      method: 'get',
      uri: `https://www.cbre-propertysearch.jp/industrial/${url}`,
    };
    const result = await request_promise(options);
    winston.info(result);
    const $ = cheerio.load(result);
    const dataWarehouse = [];
    $(detailPageWarehouseConfig.DOM).each(function (e) {
      dataWarehouse.push({
        倉庫名: $(this).find(detailPageWarehouseConfig.DOM_Warehouse).text(),
        所在地: $(this).find(detailPageWarehouseConfig.DOM_Location).text(),
        交通: $(this).find(detailPageWarehouseConfig.DOM_Traffic).text(),
        規模: $(this).find(detailPageWarehouseConfig.DOM_Scale).text(),
        竣工: $(this).find(detailPageWarehouseConfig.DOM_Completion).text(),
      });
    });

    return dataWarehouse;
  } catch (error) {
    winston.info(error);
  }
}

export { WarehouseCrawlDataServices, detailPageWarehouseServices };
