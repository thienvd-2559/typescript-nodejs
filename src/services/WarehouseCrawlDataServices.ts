import puppeteer from 'puppeteer';
import winston from '../config/winston';

import request_promise from 'request-promise';
import cheerio from 'cheerio';

async function WarehouseCrawlDataServices() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.on('request', (req) => {
    const url = req.url().toLowerCase();
    const resourceType = req.resourceType();
    if ( req.resourceType() === 'image' || resourceType === 'media' || url.endsWith('.mp4') || url.endsWith('.avi') || url.endsWith('.flv') || url.endsWith('.mov') || url.endsWith('.wmv')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto('https://www.cbre-propertysearch.jp/industrial/', {
    waitUntil: 'load',
    timeout: 0,
  });
  await page.content();
  const electronicData = await page.evaluate(() => {
    const data = [];
    document.querySelectorAll('#contents > div.topArea > div.section.areas > div > div >.group').forEach((e) => {
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
}

async function detailPageWarehouseServices(url) {
  const options = {
    method:'get',
    uri:`https://www.cbre-propertysearch.jp/industrial/${url}`,
  };
  const result = await request_promise(options);
  // console.log(result);
  const $ = cheerio.load(result);
  const data = [];
  $('#contents > div > div.propertyList > div > div.itemGroup >.item').each(function(e){
    data.push({
      倉庫名 : $(this).find(' div.inner > div > div.body > div.head > h2 > a').text(),
      所在地 : $(this).find('div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(1) > td').text(),
      交通 : $(this).find('div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(2) > td').text(),
      規模 : $(this).find('div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(3) > td').text(),
      竣工 : $(this).find('div.inner > div > div.body > div.info > div > table > tbody > tr:nth-child(4) > td').text(),
    });
  });
  winston.info(data);
  return data;
}

export { WarehouseCrawlDataServices, detailPageWarehouseServices };
