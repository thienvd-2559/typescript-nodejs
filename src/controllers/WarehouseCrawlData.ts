import { WarehouseCrawlDataServices, detailPageWarehouseServices } from '../services/WarehouseCrawlDataServices';

export default class WarehouseController {
    public static warehouse(req, res, next): any {
        WarehouseCrawlDataServices().then();
        return res.json({
            title: 'connect data',
        });
    }

    public static detailPage(req, res, next): any {
        detailPageWarehouseServices().then();
        return res.json({
            title: 'connect data',
        });
    }
}

