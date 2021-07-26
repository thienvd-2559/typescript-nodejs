import { crawlLinkCity, crawlPathWareHouse, detailPageWarehouse } from '../services/CrawlPageProvince';

export default class CrawlPageProvinceController {
  public static async crawlPageProvince(req, res, next): Promise<any> {
    const linkCity = await detailPageWarehouse();
    return res.json({
      data: linkCity,
    });
  }
}
