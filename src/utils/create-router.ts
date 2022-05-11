import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res })

export type Context = trpc.inferAsyncReturnType<typeof createContext>

export function createRouter() {
  return trpc.router<Context>()
}
