import express from 'express';
import e, { Router } from 'express';
import {applyJob, getAllAppliedJobs, getAllApplicants, updateApplicationStatus } from '../controller/application.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get("/apply/:id", authMiddleware, applyJob);
router.get("/get", authMiddleware, getAllAppliedJobs);
router.get("/applicants/:id", authMiddleware, getAllApplicants);
router.post("/status/:applicationId/update", authMiddleware, updateApplicationStatus);


export default router;