import puppeteer from 'puppeteer';
import winston from '../config/winston';
import LOGIN from '../constants/ConstantLogin';
import ACCOUNT from '../constants/ConstantAccountSelector';
// import util from 'util';
// import urlExist from 'url-exist';

// const urlExists = util.promisify(require('url-exists'));

async function timeSheetServices(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  // await page.exposeFunction('urlExists', urlExists);
  await page.waitForSelector(ACCOUNT.CLICK_FORM, {
    timeout: 5000,
  });
  await page.click(ACCOUNT.CLICK_FORM);

  await page.waitForSelector(ACCOUNT.USERNAME_SELECTOR, {
    timeout: 5000,
  });
  await page.click(ACCOUNT.USERNAME_SELECTOR);
  await page.keyboard.type(LOGIN.username);

  await page.waitForSelector(ACCOUNT.USERNAME_SELECTOR, {
    timeout: 5000,
  });
  await page.click(ACCOUNT.PASSWORD_SELECTOR);
  await page.keyboard.type(LOGIN.password);

  await page.waitForSelector('#wsm-login-button', {
    timeout: 5000,
  });
  await page.click(ACCOUNT.CTA_SELECTOR);

  // await page.waitForTimeout(5000);
  await page.content();


  const electronicData = await page.evaluate(() => {
    // @ts-ignore
    const test = document.querySelector('div[class="page-content"] > a > div').style.backgroundImage;
    return test;
  });
  winston.info(electronicData);

  await page.click('#user_timesheets_picker');
  await page.click(
    'body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-top > div.datepicker-months > table > tbody > tr > td > span:nth-child(6)'
  );
  // await page.waitForTimeout(5000);
  const electronicData1 = await page.evaluate(() => {
    const products = [];
    const data = document.querySelectorAll('.event-timesheets');
    data.forEach((product) => {
      const dataJson = {};
      try {
        // @ts-ignore
        dataJson.checkIn = product.querySelector('.event-in.check-time.event-time-in.col-md-6.col-xs-6.col-sm-6').innerText;
        // @ts-ignore
        dataJson.checkOut = product.querySelector('.event-out.check-time.event-time-out.col-md-6.col-xs-6.col-sm-6').innerText;
      } catch (err) {
        winston.info(err);
      }
      products.push(dataJson);
    });
    return products;
  });
  winston.info(electronicData1);
}

export { timeSheetServices };