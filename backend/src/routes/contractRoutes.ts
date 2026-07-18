import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
} from '../controllers/contractController';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize(['rh', 'admin']), getAllContracts)
  .post(authorize(['rh', 'admin']), createContract);

router.route('/:id')
  .get(getContractById)
  .put(authorize(['rh', 'admin']), updateContract)
  .delete(authorize(['rh', 'admin']), deleteContract);

export default router;