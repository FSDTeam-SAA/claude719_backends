import Routes from "express"
import { dashboardController } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../user/user.constant";

const router = Routes();

router.get('/overview', auth(userRole.admin), dashboardController.dashboardOverview)
router.get('/monthly-revenue-chart', auth(userRole.admin), dashboardController.getMonthlyReveneueChart);

export const dashboardRouter = router;