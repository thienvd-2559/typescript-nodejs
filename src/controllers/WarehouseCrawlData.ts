import { warehouseCrawlData, detailPageWarehouse, detailPageProvincial } from '../services/WarehouseCrawlDataServices';
export default class WarehouseController {
  public static async warehouse(req, res, next): Promise<any> {
    const warehouse = await warehouseCrawlData();
    return res.json({
      data: warehouse,
    });
  }

  public static async detailWarehouse(req: any, res: any, next: any) {
    const url = req.params.url;
    const detailWarehouse = await detailPageWarehouse(url);
    return res.json({
      data: detailWarehouse,
    });
  }

  public static async detailProvincial(req: any, res: any, next: any) {
    const detailProvincial = await detailPageProvincial();
    return res.json({
      data: detailProvincial,
    });
  }
}
