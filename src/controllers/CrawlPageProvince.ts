import { detailPageWarehouse } from '../services/CrawlPageProvince';

export default class CrawlPageProvinceController {
  public static async crawlPageProvince(req, res, next): Promise<any> {
    const detailWarehouse = await detailPageWarehouse();
    return res.json({
      data: detailWarehouse,
    });
  }
}
