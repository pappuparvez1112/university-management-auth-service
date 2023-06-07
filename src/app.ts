import express, { Application } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import { UserRoutes } from './app/modules/users/user.route'
// import ApiError from './errors/ApiError'

const app: Application = express()

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Application routes

app.use('/api/v1/users/', UserRoutes)

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

app.use(globalErrorHandler)

export default app
