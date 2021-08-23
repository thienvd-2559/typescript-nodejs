import { crawlDetailWarehouses, removeFolderLogs, readDataFileIfNotExists, createFolderIfNotExists, getCrawlInfo, createFolderLogs } from '../services/CrawlPageProvince';
import { FOLDER_FILE_DATA, FILE_STATUS_CRAWL, FILE_URL_WAREHOUSE, FILE_TIME, FILE_PROVINCES, FOLDER_DEBUG } from '../config/ConstFileJson';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import moment from 'moment';

let statusCrawl = 'DONE';
export default class CrawlPageProvinceController {
  public static async crawlDetailWarehouses(req, res, next): Promise<any> {
    try {
      await createFolderIfNotExists(`${FOLDER_FILE_DATA}`);
      if (!fs.existsSync(`${FOLDER_FILE_DATA}/${FILE_TIME}`)) {
        const startTime = moment().format('DD/MM/YYYY, HH:mm:ss ');
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_TIME}`, startTime);
      }
      let dateTime = '';
      // Check if there is data, if not, then go with OFF
      if (!fs.existsSync(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`)) {
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`, statusCrawl);
      }
      // Read file
      const fileStatusCrawl: any = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`);
      dateTime = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_TIME}`);
      if (fileStatusCrawl === 'ON') {
        const crawlInfo = await getCrawlInfo();
        if (!crawlInfo) {
          return res.json({
            message: 'Crawling is in progress. Please wait until it is completed',
          });
        }

        return res.json({
          message: 'Crawling is in progress. Please wait until it is completed',
          start_time: `${dateTime}`,
          total: crawlInfo.totalUrl,
          crawled: crawlInfo.crawledUrl,
          remain: crawlInfo.remainUrl,
          progress: crawlInfo.progress + '%',
        });
      } else if (fileStatusCrawl === 'OFF') {
        if (!fs.existsSync(`${FOLDER_FILE_DATA}/${FOLDER_DEBUG}/${FILE_PROVINCES}`)) {
          const startTime = moment().format('DD/MM/YYYY, HH:mm:ss');
          await writeFile(`${FOLDER_FILE_DATA}/${FILE_TIME}`, startTime);
        }
        dateTime = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_TIME}`);
        statusCrawl = 'ON';
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`, statusCrawl);
        crawlDetailWarehouses(statusCrawl);

        return res.json({
          message: `Started crawling`,
          start_time: `${dateTime}`,
        });
      } else if (fileStatusCrawl === 'DONE') {
        return res.json({
          message: `Crawling has been completed.`,
          start_time: `${dateTime}`,
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
      const dataFileStatusCrawl: any = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`);
      if (dataFileStatusCrawl !== 'DONE') {
        const dateTime = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_TIME}`);
        const crawlInfo = await getCrawlInfo();
        if (!crawlInfo) {
          return res.json({
            message: 'Crawling is in progress. Please wait until it is completed',
          });
        }

        return res.json({
          message: 'Crawling is in progress. Please wait until it is completed',
          start_time: `${dateTime}`,
          total: crawlInfo.totalUrl,
          crawled: crawlInfo.crawledUrl,
          remain: crawlInfo.remainUrl,
          progress: crawlInfo.progress + '%',
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
      const dataFileStatusCrawl: any = await readDataFileIfNotExists(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`);
      if (dataFileStatusCrawl === 'DONE') {
        await createFolderLogs();
        statusCrawl = 'OFF';
        await writeFile(`${FOLDER_FILE_DATA}/${FILE_STATUS_CRAWL}`, statusCrawl);
        return res.json({
          message: 'create folder success',
        });
      } else {
        return res.json({
          message: 'Not create folder',
        });
      }
    } catch (error) {
      return res.json({
        message: error.message,
      });
    }
  }
}
