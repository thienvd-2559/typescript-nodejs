import puppeteer from 'puppeteer';
import winston from '../config/winston';
import randomUseragent from 'random-useragent';

export async function captureScreen() {
  try {
    // open browser
    const browser = await puppeteer.launch({headless: false});
    // Mở new tab
    const page = await browser.newPage();
    await page.setViewport({width: 720, height: 720});
    // go to page
    await page.goto('https://www.homes.co.jp/chintai/b-1446290000001/');
    // capture screen and save
    await page.screenshot({path: 'house_detail.png'});

    // close browser
    await browser.close();
  } catch (e) {
    winston.error(e);
  }
}

export async function crawlListPage() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: false,
  });

  try {
    const page = await browser.newPage();
    const agent = randomUseragent.getRandom();
    winston.info(agent);
    await page.setUserAgent(agent);
    await page.setViewport({width: 1280, height: 720});
    await page.goto('https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都&page=1');
    const totalPage = await page.evaluate(() => {
      return Number(document.querySelector('#contents > div > div.propertyList > div > div.tools.bottom > div > ul > li:nth-child(6) > a').innerHTML);
    });

    for (let i = 1; i <= totalPage; i++) {
      await getUrlListPage(page, `https://www.cbre-propertysearch.jp/industrial/tokyo/?q=東京都&page=${i}`);
    }

    await browser.close();
  } catch (e) {
    winston.error(e);

    await browser.close();
  }
}

async function getUrlListPage(page, url) {
  winston.info(`Start crawl page ${url}`);
  await page.goto(url);

  const articles = await page.evaluate(() => {
    const titles = document.querySelectorAll('div.itemGroup div.item h2.name a');
    const arTitle = [];
    titles.forEach(item => {
      arTitle.push({
        href: item.getAttribute('href').trim(),
      });
    });

    return arTitle;
  });

  // list promise
  const promises = [];
  for (let i = 0; i < articles.length; i++) {
    promises.push(await getTitle(articles[i].href, page, i));
  }

  return await Promise.all(promises);
}

async function getTitle(link, page, key) {
  await page.goto(`https://www.cbre-propertysearch.jp/${link}`, {
    // Set timeout cho page
    timeout: 3000000,
  });
  await page.waitForSelector('#contents > div > div.columnSection.clearfix > div > div.bodySection');

  const dataPage = await page.evaluate(() => {
    // @ts-ignore
    const titlePage = document.querySelector('#contents > div > div.columnSection.clearfix > div > div.bodySection > table > tbody > tr:nth-child(1) > td').innerText;
    // @ts-ignore
    const location = document.querySelector('#contents > div > div.columnSection.clearfix > div > div.bodySection > table > tbody > tr:nth-child(2) > td').innerText;

    return {titlePage, location};
  });

  winston.info(`Data page ${link} is ${JSON.stringify(dataPage)}`);
  await page.waitForTimeout(Math.random() * 1000);

  return page;
}
