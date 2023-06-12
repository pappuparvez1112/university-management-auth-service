import express from 'express';
import { SemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/academic-semester',
    route: SemesterRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

// router.use('/api/v1/users/', UserRoutes);
// router.use('/api/v1/academic-semester', SemesterRoutes);

export default router;
