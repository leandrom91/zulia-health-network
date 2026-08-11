import { Router } from 'express';
import {
  getClinics,
  getClinicById,
  updateClinicService,
  updateClinicStaff,
  getAnnouncements,
  createClinic,
  deleteClinic,
  toggleClinicActive,
} from '../controllers/clinicController';

const router = Router();

router.get('/clinics', getClinics);
router.post('/clinics', createClinic);
router.get('/clinics/:id', getClinicById);
router.delete('/clinics/:id', deleteClinic);
router.put('/clinics/:id/status', toggleClinicActive);
router.put('/clinics/:id/services', updateClinicService);
router.put('/clinics/:id/staff', updateClinicStaff);
router.get('/announcements', getAnnouncements);

export default router;
