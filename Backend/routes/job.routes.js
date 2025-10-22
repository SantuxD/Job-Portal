
import { Router } from 'express';
import {createJob, getAllJobs, getJobById, getAdminCreatedJobs} from '../controller/job.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/postjobs', authMiddleware,createJob);
router.get('/getjobs', getAllJobs);
router.get('/jobs/:jobId', getJobById);
router.put('/admin/jobs', authMiddleware, getAdminCreatedJobs);


export default router;