import Routes from "express"
import { dashboardController } from "./dashboard.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../user/user.constant";

const router = Routes();

router.get('/overview', auth(userRole.admin), dashboardController.dashboardOverview)
router.get('/monthly-revenue-chart', auth(userRole.admin), dashboardController.getMonthlyReveneueChart);
router.get('/all-player-reveneue', auth(userRole.admin), dashboardController.getAllPlayersRevenue);
router.get('/all-team-reveneue', auth(userRole.admin), dashboardController.getAllTeamReveneue);
router.get('/single-player-view/:id', auth(userRole.admin), dashboardController.singleplayerView);
router.get('/single-team-view/:id', auth(userRole.admin), dashboardController.singleTeamView);
router.delete('/delete-player-account/:id', auth(userRole.admin), dashboardController.deletePlayerAccount);
router.delete('/delete-team-account/:id', auth(userRole.admin), dashboardController.deleteTeamAccount);

export const dashboardRouter = router;