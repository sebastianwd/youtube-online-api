import ytSearch from 'yt-search'
import axios from 'axios'
import _ from 'lodash'
import { z } from 'zod'
import youtubedl from 'youtube-dl-exec'
import { TRPCError } from '@trpc/server'
import { endpoints } from '~/constants'
import { createRouter } from '~/utils/create-router'
import { logger } from '~/utils/logger'

export interface YoutubeIdResponse {
  kind: string
  etag: string
  nextPageToken: string
  regionCode: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items?: {
    kind: string
    etag: string
    id: {
      kind: string
      videoId: string
    }
  }[]
}

export const youtubeRouter = createRouter()
  .query('/getVideoIds', {
    input: z.object({
      query: z.string(),
      limit: z.number().positive().optional().default(3),
    }),
    output: z.array(z.string()),
    async resolve({ input }): Promise<string[]> {
      try {
        const { data } = await axios.get<YoutubeIdResponse>(endpoints.yt(input.query, input.limit))

        return _.map(data.items, 'id.videoId')
      } catch (error) {
        return new Promise((resolve, reject) => {
          ytSearch({ query: input.query }, (err, results) => {
            if (err) reject(err)

            const { videos } = results

            if (_.isEmpty(videos)) {
              resolve([])
            }

            videos.length = input.limit

            resolve(_.map(videos, 'videoId'))
          })
        })
      }
    },
  })
  .query('/getAudioUrl', {
    input: z.object({
      url: z.string(),
    }),
    output: z.string(),
    async resolve({ input }) {
      try {
        logger.info(`getting audio url from: ${input.url}`)

        const result = await youtubedl(input.url, {
          format: 'bestaudio',
          geoBypass: true,
          getUrl: true,
        })

        return <string>(<unknown>result)
      } catch (error) {
        logger.error(error)

        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No results found for url '${input.url}'`,
        })
      }
    },
  })
