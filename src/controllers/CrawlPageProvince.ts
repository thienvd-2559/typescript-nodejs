import { detailWarehouses, crawlUrlWareHouses } from '../services/CrawlPageProvince';

export default class CrawlPageProvinceController {
  public static async detailWarehouses(req, res, next): Promise<any> {
    const detailWarehouse = await detailWarehouses();
    return res.json({
      data: detailWarehouse,
    });
  }
}
