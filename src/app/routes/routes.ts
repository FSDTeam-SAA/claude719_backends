import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { contactRouter } from '../modules/contact/contact.routes';
import { subscriptionRouter } from '../modules/subscription/subscription.routes';
import { transferhistoryRouter } from '../modules/transferhistory/transferhistory.routes';
import { nationalRouter } from '../modules/national/national.routes';
import { ratingRouter } from '../modules/rating/rating.routes';
import { newsletterRouter } from '../modules/newsletter/newsletter.routes';
import { defensiveRouter } from '../modules/defensive/defensive.routes';
import { attackingRouter } from '../modules/attackingstat/attackingstat.routes';
import { distributionstatsRouter } from '../modules/distributionstats/distributionstats.routes';
import { gkstatsRouter } from '../modules/gkstats/gkstats.routes';
import { setpiecesRouter } from '../modules/setpieces/setpieces.routes';
import { foulsRouter } from '../modules/fouls/fouls.routes';
import { playerReportRouter } from '../modules/playerreport/playerreport.routes';
import { teamRouter } from '../modules/team/team.routes';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes';
import { gkDistributionstatsRouter } from '../modules/gkdistributionstats/gkdistributionstats.routes';
import { marketvalueRouter } from '../modules/marketvalue/marketvalue.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/contact',
    route: contactRouter,
  },
  {
    path: '/subscription',
    route: subscriptionRouter,
  },
  {
    path: '/transferhistory',
    route: transferhistoryRouter,
  },
  {
    path: '/national',
    route: nationalRouter,
  },
  {
    path: '/rating',
    route: ratingRouter,
  },
  {
    path: '/newsletter',
    route: newsletterRouter,
  },
  {
    path: '/defensive',
    route: defensiveRouter,
  },
  {
    path: '/attacking',
    route: attackingRouter,
  },
  {
    path: '/distributionstats',
    route: distributionstatsRouter,
  },
  {
    path: '/gkstats',
    route: gkstatsRouter,
  },
  {
    path: '/setpieces',
    route: setpiecesRouter,
  },
  {
    path: '/fouls',
    route: foulsRouter,
  },
  {
    path: '/player-rapot',
    route: playerReportRouter,
  },
  {
    path: '/team',
    route: teamRouter,
  },
  {
    path: '/dashboard',
    route: dashboardRouter,
  },
  {
    path: '/gkdistributionstats',
    route: gkDistributionstatsRouter,
  },
  {
    path: '/marketvalue',
    route: marketvalueRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
