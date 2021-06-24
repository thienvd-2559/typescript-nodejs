import { timeSheetServices } from '../services/CrawlTimeSheetServices';

export default class TimeSheet {
    public static timeSheet(req, res, next): any {
        timeSheetServices('https://wsm.sun-asterisk.vn/en/dashboard/user_timesheets').then();
        return res.json({
            title: 'connect data',
        });
    }
}