import puppeteer from 'puppeteer';
import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { detailPageWarehouseConfig, crawlDetailPageWareHokkaidoConfig } from '../config/WarehouseCrawlDataConfig';

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


async function crawlDetailPageWareHokkaidoServices() {
  try {
    const dataPageWareHokkaido = [];
    const options = {
      method: 'get',
      uri: 'https://www.cbre-propertysearch.jp/industrial/hokkaido/',
    };
    const result = await request_promise(options);
    winston.info('result');
    const $ = cheerio.load(result);
    const dataWarehouse = [];
    $(detailPageWarehouseConfig.DOM).each(function (e) {
      dataWarehouse.push(
        $(this).find(detailPageWarehouseConfig.DOM_Warehouse).attr('href'),
      );
    });
    winston.info('dataWarehouse');

    for(const i of dataWarehouse) {
      const optionsHokkaido = {
        method: 'get',
        uri: `https://www.cbre-propertysearch.jp${i}`,
      };
      winston.info('optionsHokkaido');
      const resultHokkaido = await request_promise(optionsHokkaido);
      winston.info('resultHokkaido');
      const $2 = cheerio.load(resultHokkaido);
      const normalizeText = (text) => {
        return text.replace(/\\n/g, '').trim();
      };
      $2(crawlDetailPageWareHokkaidoConfig.DOM).each(function (e) {
        dataPageWareHokkaido.push({
          '物件名': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Property_Name).text()),
          '所在地': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Location).text()),
          '交通': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Traffic).text()),
          '用途地域': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Use_District).text()),
          '建蔽率 / 容積率'	: normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Building_Coverage_Ratio_Floor_Area_Ratio).text()),
          '延床面積'	: normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Total_Floor_Area).text()),
          '昇降機': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Elevator).text()),
          '１階床形式': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_1ST_Floor_Type).text()),
          '冷蔵冷凍設備': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Refrigerating_And_Freezing_Equipment).text()),
          'icon': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Icon).text()),
          'icon2': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Icon2).text()),
          'icon3': normalizeText($2(this).find(crawlDetailPageWareHokkaidoConfig.DOM_Icon3).text()),
        });
      });
      winston.info(dataPageWareHokkaido);
    }

    return dataPageWareHokkaido;
  } catch (error) {
    winston.info(error);
  }
}

export { WarehouseCrawlDataServices, detailPageWarehouseServices, crawlDetailPageWareHokkaidoServices };
