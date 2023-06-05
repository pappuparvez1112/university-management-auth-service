import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import usersRouter from './app/modules/users/users.route'

const app: Application = express()

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Application routes
console.log(app.get('env'))
app.use('/api/v1/users/', usersRouter)

//FOR TESTING ROUTE
app.get('/', async (req: Request, res: Response) => {
  // await userService.createUser({
  //   id: '999',
  //   password: '234567',
  //   role: 'student',
  // })
  res.send('working successfully')
})

export default app
