import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const message = await prisma.message.findFirst()
      res.status(200).json({ message: message?.content || '' })
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Nachricht' })
    }
  } else if (req.method === 'POST') {
    try {
      const { message } = req.body
      await prisma.message.upsert({
        where: { id: 1 },
        update: { content: message },
        create: { id: 1, content: message },
      })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Speichern der Nachricht' })
    }
  } else {
    res.status(405).json({ error: 'Methode nicht erlaubt' })
  }
}