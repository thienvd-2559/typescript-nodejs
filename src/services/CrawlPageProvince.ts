import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { URL_HOME_PAGE, URL_PROVINCES, LIST_PROVINCES, LIST_WAREHOUSES, LIST_DETAILS_WAREHOUSES } from '../config/WarehouseCrawlDataConfig';
import { normalizeText } from '../utils/string';
import fs from 'fs';
import { readFile } from 'fs/promises';

const fileNameUrlPageProvinces = 'urlPageProvinces.json';
const fileNameUrlDetailsWareHouse = 'urlDetailsWarehouse.json';
const fileNameOutput = 'output.json';

async function crawlLinkProvinces() {
  try {
    const optionsRequest = {
      method: 'GET',
      uri: `${URL_PROVINCES}`,
    };
    const result = await request_promise(optionsRequest);
    const operator = cheerio.load(result);
    const dataWarehouses = [];
    operator(LIST_PROVINCES.DOM_LAYOUT_PROVINCES).each(function () {
      operator(this)
        .find(LIST_PROVINCES.DOM_URL_PROVINCES)
        .each(function () {
          const dataHref = operator(this).find('a').attr('href');
          if (dataHref) {
            dataWarehouses.push({
              urlWareHouse: `${URL_HOME_PAGE}${dataHref}`,
            });
          }
        });
    });
    winston.info('[crawl success data url provinces]');
    return dataWarehouses;
  } catch (err) {
    winston.info(err);
  }
}

async function crawlUrlWareHouse() {
  const dataCrawlUrlWareHouse = [];
  const linksProvinces = await crawlLinkProvinces();
  for (const i of linksProvinces) {
    try {
      const totalPage = await totalPages(i.urlWareHouse);
      winston.info(totalPage);
      for (let k = 0; k < totalPage; k++) {
        const optionsPaging = {
          method: 'GET',
          uri: `${i.urlWareHouse}?page=${k + 1}`,
        };
        winston.info(optionsPaging.uri);
        dataCrawlUrlWareHouse.push({
          url: optionsPaging.uri,
          status: 0,
        });
        fs.writeFile(fileNameUrlPageProvinces, JSON.stringify(dataCrawlUrlWareHouse), (err) => {
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

async function urlWareHouse() {
  const dataCrawlUrlWareHouse = [];
  const dataCrawlPageProvinces = await checkDataFile();
  // winston.info(dataCrawlPageProvinces);
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
      fs.writeFile(fileNameOutput, JSON.stringify(dataCrawlUrlWareHouse), (err) => {
        if (err) throw err;
        winston.info(`save url ${optionsPaging.uri} done !`);
      });
      fs.writeFile(fileNameUrlPageProvinces, JSON.stringify(dataCrawlPageProvinces), (err) => {
        if (err) throw err;
        winston.info('update status = 1 done !');
      });
    }
  }
  return dataCrawlUrlWareHouse;
}

async function detailPageWarehouse() {
  try {
    // Check if the file exists or not
    if (!fs.existsSync(fileNameOutput)) {
      // Create file;
      fs.writeFile(fileNameOutput, '', (err) => {
        if (err) throw err;
      });
    }

    // Read file json
    let dataUrlWareHouse: any = await readFile(fileNameOutput, 'utf-8');

    // Check if the json file urlDetailsWareHouse.json has data, if file no data -> get data in function dataUrlWareHouse()
    if (Object.keys(dataUrlWareHouse).length === 0 || dataUrlWareHouse.constructor === Object) {
      dataUrlWareHouse = await urlWareHouse();
    } else {
      dataUrlWareHouse = JSON.parse(dataUrlWareHouse);
    }

    // Check file json, if status = 0 => crawl data warehouse details with status = 0 -> save data 1 file and change status = 0->1
    // Check if the file exists or not

    if (!fs.existsSync(fileNameOutput)) {
      // Create file;
      fs.writeFile(fileNameOutput, '', (err) => {
        if (err) throw err;
      });
    }

    // read file output.json . If data file dataOutput = data file output.json, else dataOutput = []
    let dataOutput = [];
    const dataFileNameOutput = await readFile(fileNameOutput, 'utf-8');
    if (Object.keys(dataFileNameOutput).length === 0 || dataFileNameOutput.constructor === Object) {
      dataOutput = [];
    } else {
      dataOutput = JSON.parse(dataFileNameOutput);
    }

    for (const dataUrl of dataUrlWareHouse) {
      const start = Date.now();
      const dataPage = [];
      if (dataUrl.status === 0) {
        const optionsProvince = {
          method: 'GET',
          uri: dataUrl.url,
        };
        const resultProvince = await request_promise(optionsProvince);
        const operator = cheerio.load(resultProvince);
        const dataImage = [];
        operator(LIST_DETAILS_WAREHOUSES.DOM_IMAGES).each(function () {
          dataImage.push(operator(this).find('img').attr('data-src'));
        });
        for (let t = 0; t < dataImage.length; t++) {
          if (dataImage[t]) {
            dataPage.push({
              key: `image[${t}]`,
              value: dataImage[t],
            });
          }
        }

        operator(LIST_DETAILS_WAREHOUSES.DOM_TABLES).each(function () {
          dataPage.push({
            key: normalizeText(operator(this).find('th').text()),
            value: normalizeText(operator(this).find('td').text()),
          });
        });
        dataUrl.status = 1;
        winston.info(dataPage);
        dataOutput.push(dataPage);

        fs.writeFile(fileNameOutput, JSON.stringify(dataOutput), (err) => {
          if (err) throw err;
          winston.info('save data detail ware house done !');
        });
        fs.writeFile(fileNameUrlDetailsWareHouse, JSON.stringify(dataUrlWareHouse), (err) => {
          if (err) throw err;
          winston.info('update status = 1 done !');
        });
        const dateTimeRequest = (Date.now() - start) / 1000;
        winston.info({
          'Request time': dateTimeRequest,
        });
        winston.info('dataPageWare');
      }
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
  let totalPage = 1;
  if (pages === '') {
    totalPage = 1;
  } else {
    totalPage = Number(pages);
  }
  return totalPage;
}

async function checkDataFile() {
  // Check if the file exists or not
  if (!fs.existsSync(fileNameUrlPageProvinces)) {
    // Create file;
    fs.writeFile(fileNameUrlPageProvinces, '', (err) => {
      if (err) throw err;
    });
  }
  // Read file json
  let data: any = await readFile(fileNameUrlPageProvinces, 'utf-8');
  // Check if the json file urlDetailsWareHouse.json has data, if file no data -> get data in function crawlUrlWareHouse()
  if (Object.keys(data).length === 0 || data.constructor === Object) {
    data = await crawlUrlWareHouse();
  } else {
    data = JSON.parse(data);
  }
  return data;
}

export { detailPageWarehouse };
