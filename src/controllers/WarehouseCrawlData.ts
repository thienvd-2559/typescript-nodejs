import { WarehouseCrawlDataServices, detailPageWarehouseServices } from '../services/WarehouseCrawlDataServices';
export default class WarehouseController {
  public static async warehouse(req, res, next): Promise<any> {
    // WarehouseCrawlDataServices().then();
    // return res.json({
    //     title: 'connect data',
    // });
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
}