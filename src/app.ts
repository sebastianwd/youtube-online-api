import './variables'
import * as trpcExpress from '@trpc/server/adapters/express'
import { expressHandler } from 'trpc-playground/handlers/express'
import express from 'express'
import { youtubeRouter } from './routers/youtube'
import { createRouter, createContext } from './utils/create-router'
import { env } from './constants'
import { logger } from './utils/logger'

const appRouter = createRouter().merge('yt', youtubeRouter)

const apiEndpoint = '/api'
const playgroundEndpoint = '/playground'

const app = express()

app.get('/', (_, res) => {
  return res.json({ hello: 'wait-on 💨' })
})

app.use(
  apiEndpoint,
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)
;(async () => {
  try {
    app.use(
      playgroundEndpoint,
      await expressHandler({
        trpcApiEndpoint: apiEndpoint,
        playgroundEndpoint,
        router: appRouter,
        // request: {
        //   superjson: true,
        // },
      }),
    )

    app.listen(env.PORT, () => {
      logger.info(`server listening on ${env.PORT}`)
    })
  } catch (err) {
    logger.error(err)

    process.exit(1)
  }
})()

export type AppRouter = typeof appRouter
