import { detailWarehouses, removeFolderLogs, readDataFile } from '../services/CrawlPageProvince';
import { FOLDER_FILE_JSON, FILE_STATUS_CRAWL } from '../config/ConstFileJson';
import { writeFile } from 'fs/promises';
import fs from 'fs';

let statusCrawl = 'OFF';
export default class CrawlPageProvinceController {
  public static async detailWarehouses(req, res, next): Promise<any> {
    // Check if there is data, if not, then go with OFF
    if (!fs.existsSync(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`)) {
      fs.writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl, (err) => {
        if (err) throw err;
      });
    }
    writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
    // Read file
    const status: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`);
    if (status === 'ON') {
      return res.json({
        data: 'Data is being crawled, please wait until the crawl is complete',
      });
    } else {
      statusCrawl = 'ON';
      writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
      detailWarehouses(statusCrawl);
      return res.json({
        data: 'Start crawling',
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
