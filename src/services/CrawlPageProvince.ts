import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { URL_HOME_PAGE, URL_PROVINCES, LIST_PROVINCES, LIST_WAREHOUSES, DETAILS_WAREHOUSE } from '../config/WarehouseCrawlDataConfig';
import { DATA_URL_PAGE_PROVINCES, DATA_URL_DETAILS_WAREHOUSE, DATA_OUTPUT, TIMEOUT } from '../config/ConstFileJson';
import { normalizeText } from '../utils/string';
import fs from 'fs';
import { readFile } from 'fs/promises';

async function crawlUrlProvinces() {
  try {
    const optionsRequest = {
      method: 'GET',
      uri: `${URL_PROVINCES}`,
    };
    const result = await request_promise(optionsRequest);
    const operator = cheerio.load(result);
    const dataProvinces = [];
    operator(LIST_PROVINCES.DOM_LAYOUT_PROVINCES).each(function () {
      operator(this)
        .find(LIST_PROVINCES.DOM_URL_PROVINCES)
        .each(function () {
          const dataHref = operator(this).find('a').attr('href');
          if (dataHref) {
            dataProvinces.push({
              urlProvince: `${URL_HOME_PAGE}${dataHref}`,
            });
          }
        });
    });
    winston.info('[crawl success data url provinces]');

    return dataProvinces;
  } catch (err) {
    winston.info(err);
  }
}

async function saveUrlProvinces() {
  const dataCrawlUrlWareHouse = [];
  const urlProvinces = await crawlUrlProvinces();
  await waitingTime();

  for (const i of urlProvinces) {
    try {
      const totalPage = await totalPages(i.urlProvince);
      winston.info(totalPage);
      for (let k = 0; k < totalPage; k++) {
        const optionsPaging = {
          method: 'GET',
          uri: `${i.urlProvince}?page=${k + 1}`,
        };
        dataCrawlUrlWareHouse.push({
          url: optionsPaging.uri,
          status: 0,
        });
        fs.writeFile(DATA_URL_PAGE_PROVINCES, JSON.stringify(dataCrawlUrlWareHouse), (err) => {
          if (err) throw err;
          winston.info(`save url ${optionsPaging.uri} done !`);
        });
      }
    } catch (error) {
      winston.info(error);
    }
  }
  winston.info('[crawl success data url ware house]');

  return dataCrawlUrlWareHouse;
}

async function crawlUrlWareHouses() {
  const dataCrawlUrlWareHouse = [];
  existsPath(DATA_URL_PAGE_PROVINCES);
  const dataCrawlPageProvinces = await getDataFileNotTimeOut(DATA_URL_PAGE_PROVINCES, saveUrlProvinces);
  await waitingTime();

  for (const dataPageProvince of dataCrawlPageProvinces) {
    if (dataPageProvince.status === 0) {
      const optionsPaging = {
        method: 'GET',
        uri: `${dataPageProvince.url}`,
      };
      const resultPaging = await request_promise(optionsPaging);
      const operatorPaging = cheerio.load(resultPaging);
      operatorPaging(LIST_WAREHOUSES.DOM_URL_WAREHOUSES).each(function () {
        dataCrawlUrlWareHouse.push({
          url: `${URL_HOME_PAGE}${operatorPaging(this).find('a').attr('href')}`,
          status: 0,
        });
      });
      dataPageProvince.status = 1;
      fs.writeFile(DATA_URL_DETAILS_WAREHOUSE, JSON.stringify(dataCrawlUrlWareHouse), (err) => {
        if (err) throw err;
        winston.info(`save url ${optionsPaging.uri} done !`);
      });
      fs.writeFile(DATA_URL_PAGE_PROVINCES, JSON.stringify(dataCrawlPageProvinces), (err) => {
        if (err) throw err;
        winston.info('update status = 1 done !');
      });
    }
  }

  return dataCrawlUrlWareHouse;
}

async function detailPageWarehouses() {
  try {
    // Check file json, if status = 0 => crawl data warehouse details with status = 0 -> save data 1 file and change status = 0->1
    // Check if the file exists or not
    if (!fs.existsSync(DATA_OUTPUT)) {
      // Create file;
      fs.writeFile(DATA_OUTPUT, '', (err) => {
        if (err) throw err;
      });
    }

    // read file output.json . If data file dataOutput = data file output.json, else dataOutput = []
    const dataFileNameOutput = await readFile(DATA_OUTPUT, 'utf-8');
    let dataOutput = [];
    if (Object.keys(dataFileNameOutput).length !== 0 && dataFileNameOutput.constructor !== Object) {
      dataOutput = JSON.parse(dataFileNameOutput);
    }

    existsPath(DATA_URL_DETAILS_WAREHOUSE);
    const dataUrlWareHouses = await getDataFileTimeOut(DATA_URL_DETAILS_WAREHOUSE, crawlUrlWareHouses);

    await waitingTime();

    for (const dataUrl of dataUrlWareHouses) {
      const timeStartCrawl = Date.now();
      const dataWarehouse = [];

      if (dataUrl.status !== 0) {
        continue;
      }

      const optionsWarehouse = {
        method: 'GET',
        uri: dataUrl.url,
      };
      const resultProvince = await request_promise(optionsWarehouse);
      const operator = cheerio.load(resultProvince);
      operator(DETAILS_WAREHOUSE.DOM_IMAGES).each(function () {
        const image = operator(this).find('img').attr('data-src');
        if (image) {
          dataWarehouse.push({
            value: image,
          });
        }
      });
      operator(DETAILS_WAREHOUSE.DOM_TABLES).each(function () {
        dataWarehouse.push({
          key: normalizeText(operator(this).find('th').text()),
          value: normalizeText(operator(this).find('td').text()),
        });
      });
      dataUrl.status = 1;
      dataOutput.push(dataWarehouse);
      fs.writeFile(DATA_OUTPUT, JSON.stringify(dataOutput), (err) => {
        if (err) throw err;
        winston.info('save data detail ware house done !');
      });
      fs.writeFile(DATA_URL_DETAILS_WAREHOUSE, JSON.stringify(dataUrlWareHouses), (err) => {
        if (err) throw err;
        winston.info('update status = 1 done !');
      });
      const dateTimeRequest = (Date.now() - timeStartCrawl) / 1000;
      winston.info({
        'Request time': dateTimeRequest,
      });
    }
    winston.info('[crawl success data details ware house]');

    return dataOutput;
  } catch (error) {
    winston.info(error);
  }
}

async function totalPages(url) {
  const options = {
    method: 'GET',
    uri: url,
  };
  const result = await request_promise(options);
  const operator = cheerio.load(result);
  const pages = operator(LIST_WAREHOUSES.DOM_TOTAL_PAGING).text();

  return pages === '' ? 1 : Number(pages);
}

async function existsPath(path) {
  // Check if the file exists or not
  if (!fs.existsSync(path)) {
    // Create file;
    fs.writeFile(path, '', (err) => {
      if (err) throw err;
    });
  }
}

async function getDataFileNotTimeOut(path, functionPass) {
  // Read file json
  let data: any = await readFile(path, 'utf-8');
  // Check if the json file urlDetailsWareHouse.json has data, if file no data -> get data in function crawlUrlWareHouse()
  if (Object.keys(data).length === 0 || data.constructor === Object) {
    data = await functionPass();
  } else {
    data = JSON.parse(data);
  }

  return data;
}

async function getDataFileTimeOut(path, functionPass) {
  try {
    // Read file json
    let data: any = await readFile(path, 'utf-8');
    // Check if the json file urlDetailsWareHouse.json has data, if file no data -> get data in function crawlUrlWareHouse()
    if (Object.keys(data).length === 0 || data.constructor === Object) {
      data = await functionPass();
    } else {
      data = JSON.parse(data);
      let urlPageProvinces: any = await readFile(DATA_URL_PAGE_PROVINCES, 'utf-8');
      urlPageProvinces = JSON.parse(urlPageProvinces);
      const checkStatus = urlPageProvinces.find((url) => url.status === 0);
      if (checkStatus) {
        data = await functionPass();
      }
    }

    return data;
  } catch (error) {
    winston.info(error);
  }
}

async function waitingTime() {
  return await new Promise((resolve: any) => {
    setTimeout(() => {
      winston.info('waitingTime');
      resolve();
    }, TIMEOUT);
  });
}

export { crawlUrlProvinces, saveUrlProvinces, crawlUrlWareHouses, detailPageWarehouses };
