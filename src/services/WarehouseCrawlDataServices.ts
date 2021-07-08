import puppeteer from 'puppeteer';
import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { warehouseCrawlDataConfig, detailPageWarehouseConfig } from '../config/WarehouseCrawlDataConfig'

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
      // total '.' appear in a string
      const total = url.split('.').length - 1;
      // show last string  
      const video = url.split('\'')[total];
      // winston.info(video)
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
      document.querySelectorAll(warehouseCrawlDataConfig.DOM).forEach((e) => {
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
    // winston.info(result);
    const $ = cheerio.load(result);
    const dataWarehouse = [];
    $(detailPageWarehouseConfig.DOM).each(function(e){
      dataWarehouse.push({
        倉庫名 : $(this).find(detailPageWarehouseConfig.DOM_倉庫名).text(),
        所在地 : $(this).find(detailPageWarehouseConfig.DOM_所在地).text(),
        交通 : $(this).find(detailPageWarehouseConfig.DOM_交通).text(),
        規模 : $(this).find(detailPageWarehouseConfig.DOM_規模).text(),
        竣工 : $(this).find(detailPageWarehouseConfig.DOM_竣工).text(),
      });
    });
    winston.info(dataWarehouse);
    return dataWarehouse;
  } catch(error){
    winston.info(error);
  }
}

export { WarehouseCrawlDataServices, detailPageWarehouseServices };
