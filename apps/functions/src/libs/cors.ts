import cors from 'cors'

export const corsHandler = cors({
  origin: ['http://localhost:5173', 'https://tile-fawn.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
})