import winston from '../config/winston';
import request_promise from 'request-promise';
import cheerio from 'cheerio';
import { URL_PROVINCES, LIST_PROVINCES, LIST_STORES } from '../config/WarehouseCrawlDataConfig';
import { normalizeText } from '../utils/string';
import fs from 'fs';
// tslint:disable-next-line: no-var-requires
const fsPromises = require('fs').promises;

async function crawlLinkCity() {
  try {
    const options = {
      method: 'GET',
      uri: `${URL_PROVINCES}`,
    };
    // winston.info(options.uri);
    const result = await request_promise(options);
    // winston.info('result');
    const symbol = cheerio.load(result);
    const dataWarehouse = [];
    symbol('#contents > div.topArea > div').each(function () {
      symbol(this)
        .find('div > div > div > ul > li')
        .each(function () {
          const dataHref = symbol(this).find('a').attr('href');
          // winston.info('dataHref');
          if (dataHref) {
            dataWarehouse.push({
              pathWareHouse: `https://www.cbre-propertysearch.jp${dataHref}`,
              status: 0,
            });
          }
        });
    });
    return dataWarehouse;
  } catch (err) {
    winston.info(err);
  }
}

async function crawlPathWareHouse() {
  const data = [];
  const linksCity = await crawlLinkCity();
  // winston.info(array);
  for (const i of linksCity) {
    try {
      const options = {
        method: 'GET',
        uri: i.pathWareHouse,
      };
      // winston.info(options.uri);
      const result = await request_promise(options);
      // winston.info(result);
      const symbol = cheerio.load(result);
      const total = symbol('#contents > div > div.propertyList > div > div.propertyListTools > div.group > div.paginate > ul > li:last-child > a').text();
      winston.info({ kq: total });
      let totalCount = 1;
      if (total === '') {
        totalCount = 1;
      } else {
        // tslint:disable-next-line: radix
        totalCount = parseInt(total);
      }
      winston.info(totalCount);

      for (let k = 0; k < totalCount; k++) {
        const optionsPaging = {
          method: 'GET',
          uri: `${options.uri}?page=${k + 1}`,
        };
        winston.info(optionsPaging.uri);
        const resultPaging = await request_promise(optionsPaging);
        const symbolPaging = cheerio.load(resultPaging);
        const dataPage = [];
        symbolPaging('#contents > div > div.propertyList > div > div.itemGroup > div > div.inner > div > div.body > div.head > h2').each(function () {
          dataPage.push({
            key: 'url',
            value: `https://www.cbre-propertysearch.jp${symbolPaging(this).find('a').attr('href')}`,
            status: 0,
          });
        });
        // winston.info('dataPage');
        data.push(dataPage);
        fs.writeFile('pathDetailsWareHouse.json', JSON.stringify(data), (err) => {
          if (err) throw err;
          winston.info('done !');
        });
      }
    } catch (error) {
      winston.info(error);
    }
  }
  return data;
}

async function detailPageWarehouse() {
  try {
    // Đọc file json
    let dataPathWareHouse = await fsPromises.readFile('pathDetailsWareHouse.json', 'utf8');
    winston.info('dataPathWareHouse');

    // Ktra xem file json co du lieu khong, neu khong co thi crawl data tu dau.
    if (Object.keys(dataPathWareHouse).length === 0 || dataPathWareHouse.constructor === Object) {
      winston.info('[null]');
      dataPathWareHouse = await crawlPathWareHouse();
      const pathWareHouses = dataPathWareHouse;
      const dataPageWare = [];
      for (const pathWareHouse of pathWareHouses) {
        const dataPageWareOne = [];
        for (const dataPath of pathWareHouse) {
          const optionsProvince = {
            method: 'GET',
            uri: dataPath.value,
          };
          winston.info('optionsProvince');
          winston.info(dataPath.value);
          const resultProvince = await request_promise(optionsProvince);
          winston.info('resultProvince');
          const operator = cheerio.load(resultProvince);
          const dataPage = [];
          operator(LIST_STORES.DOM_TABLE).each(function () {
            dataPage.push({
              key: normalizeText(operator(this).find('th').text()),
              value: normalizeText(operator(this).find('td').text()),
            });
          });
          winston.info(dataPage);
          dataPageWareOne.push(dataPage);
          dataPath.status = 1;
        }
        fs.writeFile('pathDetailsWareHouse.json', JSON.stringify(pathWareHouses), (err) => {
          if (err) throw err;
          winston.info('done !');
        });
        dataPageWare.push(dataPageWareOne);
      }
      return dataPageWare;
    } else {
      winston.info('[Not Null]');
      let pathWareHouses = JSON.parse(dataPathWareHouse);
      // winston.info(pathWareHouses);
      // Neu mang co gia tri
      // Xoa mang rong trong data(do page hokkaido/?page=2 khong co du lieu data)
      // for (let i = 0; i < pathWareHouses.length; i++) {
      //   if (pathWareHouses[i].length === 0) {
      //     pathWareHouses.splice(i, 1);
      //   }
      // }

      // Ktra file json nếu status = 0 => Quay tro lai buoc 2 => Quay tro lai buoc 1
      const allEqual = (arr) => arr.every((v) => v.every((data) => data.status === 0));
      if (allEqual(pathWareHouses) === true) {
        winston.info('[status = 0]');
        pathWareHouses = await crawlPathWareHouse();
        const dataPageWare = [];
        for (const pathWareHouse of pathWareHouses) {
          const dataPageWareOne = [];
          for (const dataPath of pathWareHouse) {
            const optionsProvince = {
              method: 'GET',
              uri: dataPath.value,
            };
            winston.info('optionsProvince');
            const resultProvince = await request_promise(optionsProvince);
            winston.info('resultProvince');
            const operator = cheerio.load(resultProvince);
            const dataPage = [];
            operator(LIST_STORES.DOM_TABLE).each(function () {
              dataPage.push({
                key: normalizeText(operator(this).find('th').text()),
                value: normalizeText(operator(this).find('td').text()),
              });
            });
            winston.info(dataPage);
            dataPageWareOne.push(dataPage);
            dataPath.status = 1;
          }
          fs.writeFile('pathDetailsWareHouse.json', JSON.stringify(pathWareHouses), (err) => {
            if (err) throw err;
            winston.info('done !');
          });
          dataPageWare.push(dataPageWareOne);
        }
        return dataPageWare;
      }

      // Ktra file json nếu status = 1 => Da crawl data xong, khong can phai lam gi nua
      // tslint:disable-next-line: triple-equals
      const allEqual2 = (arr) => arr.every((v) => v.every((data) => data.status === 1));
      if (allEqual2(pathWareHouses) === true) {
        winston.info('[status = 1]');
        winston.info('Trang web da crawl roi');
        return 1;
      }

      // Ktra file json nếu status = 0 va 1 => Xong buoc 2, dang crawl data chi tiet cac kho
      if (allEqual(pathWareHouses) === false && allEqual2(pathWareHouses) === false) {
        winston.info('[status = 0 and 1]');
        const dataPageWare = [];
        for (const pathWareHouse of pathWareHouses) {
          const dataPageWareOne = [];
          for (const dataPath of pathWareHouse) {
            if (dataPath.status === 0) {
              const optionsProvince = {
                method: 'GET',
                uri: dataPath.value,
              };
              winston.info('optionsProvince');
              winston.info(dataPath.value);
              const resultProvince = await request_promise(optionsProvince);
              winston.info('resultProvince');
              const operator = cheerio.load(resultProvince);
              const dataPage = [];
              operator(LIST_STORES.DOM_TABLE).each(function () {
                dataPage.push({
                  key: normalizeText(operator(this).find('th').text()),
                  value: normalizeText(operator(this).find('td').text()),
                });
              });
              winston.info(dataPage);
              dataPageWareOne.push(dataPage);
              dataPath.status = 1;
            }
          }
          dataPageWare.push(dataPageWareOne);
          fs.writeFile('pathDetailsWareHouse.json', JSON.stringify(pathWareHouses), (err) => {
            if (err) throw err;
            winston.info('done !');
          });
        }
        return dataPageWare;
      }
    }
  } catch (error) {
    winston.info(error);
  }
}

export { crawlLinkCity, crawlPathWareHouse, detailPageWarehouse };
