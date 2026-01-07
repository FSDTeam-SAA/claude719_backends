import express from 'express';
import { contactController } from './contact.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.post('/', contactController.createContact);
router.get('/', auth(userRole.admin), contactController.getAllContact);
router.get('/:id', auth(userRole.admin), contactController.getSingleContact);
router.put('/:id', auth(userRole.admin), contactController.updateContact);
router.delete('/:id', auth(userRole.admin), contactController.deleteContact);

export const contactRouter = router;
