import { detailWarehouses, removeFolderLogs, readDataFile } from '../services/CrawlPageProvince';
import { FOLDER_FILE_JSON, FILE_STATUS_CRAWL } from '../config/ConstFileJson';
import { writeFile } from 'fs/promises';
import fs from 'fs';
export default class CrawlPageProvinceController {
  public static async detailWarehouses(req, res, next): Promise<any> {
    let statusCrawl = 'OFF';
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
        data: 'data is being crawled',
      });
    } else {
      statusCrawl = 'ON';
      writeFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`, statusCrawl);
      detailWarehouses(statusCrawl);
      return res.json({
        data: 'data crawl success',
      });
    }
  }

  public static async removeFolderLogs(req, res, next): Promise<any> {
    try {
      const statusCrawl: any = await readDataFile(`${FOLDER_FILE_JSON}/${FILE_STATUS_CRAWL}`);
      if (statusCrawl === 'ON') {
        return res.json({
          message: 'Data is crawling, Cannot be deleted !',
        });
      } else {
        removeFolderLogs();
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
