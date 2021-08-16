import { detailWarehouses, removeFolderLogs, readDataFile, createFolder } from '../services/CrawlPageProvince';
import { FOLDER_FILE_JSON, FILE_STATUS_CRAWL, FILE_URL_WAREHOUSE } from '../config/ConstFileJson';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import moment from 'moment';

let statusCrawl = 'OFF';
const dateTime = moment().format('DD/MM/YYYY, HH:mm:ss ');
export default class CrawlPageProvinceController {
  public static async detailWarehouses(req, res, next): Promise<any> {
    try {
      createFolder(FOLDER_FILE_JSON);
      if (!fs.existsSync(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`)) {
        await writeFile(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`, '');
      }
      // Check if there is data, if not, then go with OFF
      if (!fs.existsSync(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`)) {
        await writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
      }
      // Read file
      const getFileStatusCrawl: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`);
      if (getFileStatusCrawl === 'ON') {
        let urlWarehouse: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`);
        if (urlWarehouse.length === 0) {
          return res.json({
            message: `Crawling is in progress. Please wait until it is completed`,
          });
        }

        urlWarehouse = JSON.parse(urlWarehouse);
        const result = urlWarehouse.filter((url) => url.status === 0);
        if (result.length === 0) {
          statusCrawl = 'OFF';
          await writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
          return res.json({
            message: `Started crawling from ${dateTime} `,
          });
        }

        return res.json({
          message: `Crawling is in progress. Please wait until it is completed`,
        });
      } else {
        statusCrawl = 'ON';
        await writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
        let urlWarehouse: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_URL_WAREHOUSE}`);
        if (urlWarehouse.length === 0) {
          detailWarehouses(statusCrawl);
          return res.json({
            message: `Started crawling from ${dateTime} `,
          });
        }

        urlWarehouse = JSON.parse(urlWarehouse);
        const result = urlWarehouse.filter((url) => url.status === 0);
        if (result.length === 0) {
          statusCrawl = 'OFF';
          await writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);

          return res.json({
            message: `Crawling from ${dateTime} has been completed. Please run the delete command before continuing to crawl`,
          });
        }

        detailWarehouses(statusCrawl);
        return res.json({
          message: `Started crawling from ${dateTime}`,
        });
      }
    } catch (error) {
      return res.json({
        message: error,
      });
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
          message: 'Successfully deleted',
        });
      }
    } catch (err) {
      return res.json({
        message: 'Has a error, Please check back data file',
      });
    }
  }

  public static async resetFolderLogs(req, res, next): Promise<any> {
    try {
      const data: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`);
      // if (data === 'ON') {
      //   return res.json({
      //     message: 'Data is crawling, Cannot be deleted !',
      //   });
      // } else {
      //   await removeFolderLogs();
      //   return res.json({
      //     message: 'Successfully deleted',
      //   });
      // }
    } catch (err) {
      return res.json({
        message: 'Has a error, Please check back data file',
      });
    }
  }
}
