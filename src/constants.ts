export const env = {
  YT_COOKIE: process.env.YT_COOKIE || '',
  X_YT_ID_TOKEN: process.env.X_YT_ID_TOKEN || '',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  PORT: process.env.PORT || 3000,
}

export const endpoints = {
  yt: (query: string, limit: number) =>
    `https://www.googleapis.com/youtube/v3/search?part=Id&maxResults=${limit}&order=relevance&key=${env.YOUTUBE_API_KEY}&type=video&q=${query}`,
}
