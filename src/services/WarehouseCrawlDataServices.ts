import puppeteer from 'puppeteer';
import winston from '../config/winston';

async function WarehouseCrawlDataServices() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.on('request', (req) => {
    const url = req.url().toLowerCase();
    const resourceType = req.resourceType();
    if (
      req.resourceType() === 'image' ||
      resourceType === 'media' ||
      url.endsWith('.mp4') ||
      url.endsWith('.avi') ||
      url.endsWith('.flv') ||
      url.endsWith('.mov') ||
      url.endsWith('.wmv')
    ) {
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
    document
      .querySelectorAll(
        '#contents > div.topArea > div.section.areas > div > div >.group'
      )
      .forEach((e) => {
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
}

async function crawlTheProvincial() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  await page.on('request', (req) => {
    const url = req.url().toLowerCase();
    const resourceType = req.resourceType();
    if (
      req.resourceType() === 'image' ||
      resourceType === 'media' ||
      url.endsWith('.mp4') ||
      url.endsWith('.avi') ||
      url.endsWith('.flv') ||
      url.endsWith('.mov') ||
      url.endsWith('.wmv')
    ) {
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
    const products = [];
    // @ts-ignore
    const data = document.querySelectorAll('div[class="group"] > ul > li > a');
    data.forEach((product) => {
      const dataJson = {};
      // @ts-ignore
      dataJson.regions = product.innerText;
      products.push(dataJson);
    });
    return products;
  });
  return electronicData;
}

async function detailPageWarehouseServices() {
  // const urls = await crawlTheProvincial();
  // for(const url of urls) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // await page.goto(`https://www.cbre-propertysearch.jp/industrial/${url}`, {
    //   waitUntil: 'load',
    //   timeout: 0,
    // });

    await page.goto('https://www.cbre-propertysearch.jp/industrial/tokyo/', {
      waitUntil: 'load',
      timeout: 0,
    });
    // await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.content();
    const dataPage = await page.evaluate(() => {
      // @ts-ignore
      const titlePage = document.querySelector('#contents > div > div.propertyList > div > div.itemGroup > div:nth-child(2) > div > div > div.img > a').href;
      // @ts-ignore
      const location = document.querySelector('#contents > div > div.propertyList > div > div.itemGroup > div:nth-child(2) > div > div > div.body > div.head > h2 > a').innerText;

      return {titlePage, location};
    });

    winston.info(dataPage);
  }
// }

export { WarehouseCrawlDataServices, detailPageWarehouseServices };
