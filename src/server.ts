import mongoose from 'mongoose'
import app from './app'
import config from './config/index'
import { errorlogger, logger } from './shared/logger'

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info(`✔ Database is connected successfully `)
  } catch (err) {
    errorlogger.error(' 😢 Failed to connect database', err)
  }

  app.listen(config.port, () => {
    logger.info(`Application listening on port ${config.port}`)
  })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

bootstrap()
