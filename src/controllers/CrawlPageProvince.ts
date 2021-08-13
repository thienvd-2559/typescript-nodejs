import { detailWarehouses, removeFolderLogs, readDataFile } from '../services/CrawlPageProvince';
import { FOLDER_FILE_JSON, FILE_STATUS_CRAWL, FILE_URL_WAREHOUSE } from '../config/ConstFileJson';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import winston from '../config/winston';

let statusCrawl = 'OFF';
export default class CrawlPageProvinceController {
  public static async detailWarehouses(req, res, next): Promise<any> {
    if (!fs.existsSync(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`)) {
      writeFile(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`, '');
    }
    // Check if there is data, if not, then go with OFF
    if (!fs.existsSync(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`)) {
      writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
    }
    // Read file
    const status: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`);
    if (status === 'ON') {
      let urlWarehouse: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`);
      if (urlWarehouse.length === 0) {
        return res.json({
          message: 'Data is being crawled, please wait until the crawl is complete',
        });
      }
      urlWarehouse = JSON.parse(urlWarehouse);
      const result = urlWarehouse.filter((url) => url.status !== 1);
      if (result.length === 0) {
        statusCrawl = 'OFF';
        await writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
        return res.json({
          message: 'Crawling data success',
        });
      }
      return res.json({
        message: 'Data is being crawled, please wait until the crawl is complete',
      });
    } else {
      statusCrawl = 'ON';
      writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
      const dataFileWarehouse = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`);
      if (dataFileWarehouse === '') {
        detailWarehouses(statusCrawl);
        return res.json({
          message: 'Start crawling',
        });
      } else {
        statusCrawl = 'OFF';
        writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
        return res.json({
          message: 'Crawling data success',
        });
      }
    }
  }

  public static async removeFolderLogs(req, res, next): Promise<any> {
    try {
      const data: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`);
      if (data === 'ON') {
        return res.json({
          message: 'Data is crawling, Cannot be deleted !',
        });
      } else {
        await removeFolderLogs();
        return res.json({
          message: 'successful delete',
        });
      }
    } catch (err) {
      return res.json({
        message: 'Has a error, Please check back data file',
      });
    }
  }
}
