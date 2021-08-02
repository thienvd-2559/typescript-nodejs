import { detailPageWarehouses, crawlUrlWareHouses } from '../services/CrawlPageProvince';

export default class CrawlPageProvinceController {
  public static async crawlPageProvince(req, res, next): Promise<any> {
    const detailWarehouse = await detailPageWarehouses();
    return res.json({
      data: detailWarehouse,
    });
  }
}
