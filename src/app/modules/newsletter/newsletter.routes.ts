import express from 'express';
import { newsletterController } from './newsletter.controller';

const router = express.Router();

router.post('/', newsletterController.createNewsLetter);
router.get('/', newsletterController.getAllnewsLetter);
router.get('/:id', newsletterController.getSingle);
router.delete('/:id', newsletterController.deleteNewsletter);
router.post('/broadcast', newsletterController.broadcastNewsletter);

export const newsletterRouter = router;
