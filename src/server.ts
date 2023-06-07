/* eslint-disable prefer-const */
import mongoose from 'mongoose'
import app from './app'
import config from './config/index'
import { errorlogger, logger } from './shared/logger'
import { Server } from 'http'

process.on('uncaughtException', error => {
  console.log('uncoughtException is detect', error)
  errorlogger.error(error)
  process.exit(1)
})
let server: Server
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info(`✔ Database is connected successfully `)
  } catch (err) {
    errorlogger.error(' 😢 Failed to connect database', err)
  }

  process.on('unhandledRejection', error => {
    // console.log('unhandle rejection is detected, we are closing our server....')
    if (server) {
      server.close(() => {
        errorlogger.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })

  server = app.listen(config.port, () => {
    logger.info(`Application listening on port ${config.port}`)
  })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

bootstrap()

process.on('SIGTERM', () => {
  logger.info('Sigterm is recieved')
  if (server) {
    server.close()
  }
})
