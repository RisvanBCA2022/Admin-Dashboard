import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://eu2-above-chigger-31284.upstash.io',
  token: process.env.REDIS_key!,
})

// const data = await redis.set('foo', 'bar');