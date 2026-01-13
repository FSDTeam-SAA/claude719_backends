import Routes from "express"
import { dashboardController } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../user/user.constant";

const router = Routes();

router.get('/overview', auth(userRole.admin), dashboardController.dashboardOverview)
router.get('/monthly-revenue-chart', auth(userRole.admin), dashboardController.getMonthlyReveneueChart);
router.get('/single-player-view/:id', auth(userRole.admin), dashboardController.singleplayerView);
router.get('/single-team-view/:id', auth(userRole.admin), dashboardController.singleTeamView);
router.delete('/delete-player-account/:id', auth(userRole.admin), dashboardController.deletePlayerAccount);
router.delete('/delete-team-account/:id', auth(userRole.admin), dashboardController.deleteTeamAccount);
router.get('/total-revenue', auth(userRole.admin), dashboardController.totalRevenue);

export const dashboardRouter = router;