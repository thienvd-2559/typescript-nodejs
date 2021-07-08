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
      const arrayTypeVideo = ['image', 'media'];
      const endsWith = [ '.mp4', '.avi', '.flv', '.mov', '.wmv'];
      const url = req.url().toLowerCase();
      const resourceType = req.resourceType();
      for(const typeVideoImage of arrayTypeVideo) {
        for(const endWith of endsWith) {
          if(resourceType === typeVideoImage && url.endsWith(endWith)) {
            req.abort();
          } else {
            req.continue();
          }
        }
      }
    });

    await page.goto('https://www.cbre-propertysearch.jp/industrial/', {
      waitUntil: 'load',
      timeout: 30000,
    });
    await page.content();
    const electronicData = await page.evaluate(() => {
      const data = [];
      const DOM  = '#contents > div.topArea > div.section.areas > div > div >.group';
      document.querySelectorAll(DOM).forEach((e) => {
        const products = [];
        e.querySelectorAll('ul>li').forEach((el) => {
          // @ts-ignore
          products.push(el.innerText);
        });
        data.push({
          name: e.querySelector('p').innerHTML,
          products,
        });
      });
      return data;
    });
    winston.info(electronicData);
    return electronicData;
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
