import { detailWarehouses, removeFolderLogs } from '../services/CrawlPageProvince';

export default class CrawlPageProvinceController {
  public static async detailWarehouses(req, res, next): Promise<any> {
    const detailWarehouse = await detailWarehouses();
    return res.json({
      data: detailWarehouse,
    });
  }

  public static async removeFolderLogs(req, res, next): Promise<any> {
    const removeFolder = await removeFolderLogs(req, res, next);
    return res.json({
      message: removeFolder,
    });
  }
}
