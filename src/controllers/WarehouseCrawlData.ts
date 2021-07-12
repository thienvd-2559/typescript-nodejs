import { WarehouseCrawlDataServices, detailPageWarehouseServices, crawlDetailPageWareTokyoServices } from '../services/WarehouseCrawlDataServices';
export default class WarehouseController {
  public static async warehouse(req, res, next): Promise<any> {
    const warehouse = await WarehouseCrawlDataServices();
    return res.json({
      data: warehouse,
    });
  }
  public static async detailPage(req: any, res: any, next: any) {
    const url = req.params.url;
    const detailPageWarehouse = await detailPageWarehouseServices(url);
    return res.json({
      data: detailPageWarehouse,
    });
  }
  public static async crawlDetailPageWareTokyo(req: any, res: any, next: any) {
    const detailPageTokio = await crawlDetailPageWareTokyoServices();
    return res.json({
      data: detailPageTokio,
    });
  }
}