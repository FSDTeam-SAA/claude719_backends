import express from 'express';
import { teamControllers } from './team.controller';
const router = express.Router();

router.post('/', teamControllers.createteam);

export const teamRouter = router;
