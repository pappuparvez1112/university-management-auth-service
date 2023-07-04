import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
// import ApiError from './errors/ApiError'

const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Application routes

app.use('/api/v1/', routes);
// app.use('/api/v1/academic-semester', SemesterRoutes);

// //FOR TESTING ROUTE
// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error('testing error logger')
//   //Promise.reject(new Error('Unhandle promise rejection'))
//   //grace fully handling server and doing it server.ts to off
//   // await userService.createUser({
//   //   id: '999',
//   //   password: '234567',
//   //   role: 'student',
//   // })
//   // res.send('working successfully')

//   //   throw new ApiError(400, 'generic error')
//   //   next('next error')
//   //   throw new Error('there was an error')
// })

app.use(globalErrorHandler);

//notfoundRoute

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api not found',
      },
    ],
  });
  next();
});

// const academicSemester = {
//   code: '01',
//   year: '2025',
// };

// const testId = async () => {
//   const testId = await generateStudentId(academicSemester);
//   console.log(testId);
// };

// const testId = async () => {
//   const testId = await generateFacultyId();
//   console.log(testId);
// };
// testId();

export default app;
