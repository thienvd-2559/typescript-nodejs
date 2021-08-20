import { crawlDetailWarehouses, removeFolderLogs, readDataFileIfNotExists, createFolderIfNotExists, resetFolderLogs } from '../services/CrawlPageProvince';
import { FOLDER_FILE_DATA, FILE_STATUS_CRAWL, FILE_URL_WAREHOUSE, FILE_TIME, FILE_PROVINCES } from '../config/ConstFileJson';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import moment from 'moment';

let statusCrawl = 'OFF';

export default class CrawlPageProvinceController {
  public static async crawlDetailWarehouses(req, res, next): Promise<any> {
    try {
      if (!fs.existsSync(`${FOLDER_FILE_DATA}/${FILE_PROVINCES}`)) {
        const startTime = moment().format('DD/MM/YYYY, HH:mm:ss ');
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_TIME}`, startTime);
      }
      let dateTime = '';
      await createFolderIfNotExists(FOLDER_FILE_DATA);
      // // Check if there is data, if not, then go with OFF
      if (!fs.existsSync(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`)) {
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`, statusCrawl);
      }
      // Read file
      const fileStatusCrawl: any = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`);
      dateTime = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_TIME}`);
      if (fileStatusCrawl === 'ON') {
        return res.json({
          message: `Crawling from ${dateTime} is in progress. Please wait until it is completed`,
        });
      } else if (fileStatusCrawl === 'OFF') {
        statusCrawl = 'ON';
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`, statusCrawl);
        crawlDetailWarehouses(statusCrawl);
        return res.json({
          message: `Started crawling from ${dateTime}`,
        });
      } else if (fileStatusCrawl === 'DONE') {
        return res.json({
          message: `Crawling from ${dateTime} has been completed. Please run the delete command before continuing to crawl`,
        });
      }
    } catch (error) {
      return res.json({
        message: error,
      });
    }
  }

  public static async removeFolder(req, res, next): Promise<any> {
    try {
      const data: any = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`);
      if (data !== 'DONE') {
        const dateTime = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_TIME}`);
        return res.json({
          message: `Crawling from ${dateTime} is in progress. Please wait until it is completed`,
        });
      } else {
        await removeFolderLogs();
        statusCrawl = 'OFF';
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`, statusCrawl);
        return res.json({
          message: 'Successfully deleted',
        });
      }
    } catch (err) {
      return res.json({
        message: 'Has a error, Please check back data file',
      });
    }
  }

  public static async resetFolder(req, res, next): Promise<any> {
    try {
      const data: any = await resetFolderLogs();
      return res.json({
        message: 'create folder success',
      });
    } catch (error) {
      return res.json({
        message: error.message,
      });
    }
  }
}
