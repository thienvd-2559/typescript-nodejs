import puppeteer from 'puppeteer';
import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';

async function WarehouseCrawlDataServices() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.on('request', (req) => {
      const type = ['image', 'media'];
      const videos = [ '.mp4', '.avi', '.flv', '.mov', '.wmv'];
      const url = req.url().toLowerCase();
      const resourceType = req.resourceType();
      const total = url.split('.').length - 1;
      const video = url.split('\'')[total];
      if(videos.includes(video) === true || type.includes(resourceType) === true) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.goto('https://www.cbre-propertysearch.jp/industrial/', {
      waitUntil: 'load',
      timeout: 30000,
    });
    await page.content();
    const Domain = await page.evaluate(() => {
      const domain = [];
      const DOM  = '#contents > div.topArea > div.section.areas > div > div >.group';
      document.querySelectorAll(DOM).forEach((e) => {
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
    // winston.info(Domain);
    return Domain;
  } catch (error) {
    winston.info(error);
  }
}

async function detailPageWarehouseServices(url) {
  try{
    const options = {
      method:'get',
      uri:`https://www.cbre-propertysearch.jp/industrial/${url}`,
    };
    const result = await request_promise(options);
    // console.log(result);
    const $ = cheerio.load(result);
    const dataWarehouse = [];
    const DOM = '#contents > div > div.propertyList > div > div.itemGroup >.item';
    const DOM_倉庫名 = 'div.inner > div > div.body > div.head > h2 > a';
    const DOM_所在地 = 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td';
    const DOM_交通 = 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td';
    const DOM_規模 = 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td';
    const DOM_竣工 = 'div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td';
    $(DOM).each(function(e){
      dataWarehouse.push({
        倉庫名 : $(this).find(DOM_倉庫名).text(),
        所在地 : $(this).find(DOM_所在地).text(),
        交通 : $(this).find(DOM_交通).text(),
        規模 : $(this).find(DOM_規模).text(),
        竣工 : $(this).find(DOM_竣工).text(),
      });
    });
    winston.info(dataWarehouse);
    return dataWarehouse;
  } catch(error){
    winston.info(error);
  }
}

export { WarehouseCrawlDataServices, detailPageWarehouseServices };
