'use server'

import { kv } from '@vercel/kv'

import { type Chat } from '@/lib/types'

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}
