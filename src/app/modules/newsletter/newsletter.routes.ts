import express from 'express';
import { newsletterController } from './newsletter.controller';

const router = express.Router();

router.post('/', newsletterController.createNewsLetter);
router.post('/broadcast', newsletterController.broadcastNewsletter);

export const newsletterRouter = router;
