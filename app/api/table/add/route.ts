import { kv } from '@vercel/kv'
import { sql } from '@vercel/postgres';
import { auth } from '@/auth'
import { getUserKVKey, getUserTableName } from '@/lib/utils'

export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const { data, fileName } = json
  console.log('ADD TABLE PAYLOAD', data, fileName)
  const userId = '345345'
  /*
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  */

  // Parse csv to insert snippet into KV store.
  // Expect data to be an array of arrays
  const tableHead = data.slice(0, 4)
  const tableName = getUserTableName(userId, fileName)
  const tableSnippet = tableHead.map((x: Array<string>) => x.join(', ')).join('\n')
  const kvKey = getUserKVKey(userId, 'tableSnippets')

  // Update KV store.
  const tableSnippets = await kv.get(kvKey) || {}
  console.log('KV GET', kvKey, tableSnippets)
  const updatedTableSnippets = {
    ...tableSnippets,
    [tableName]: tableSnippet
  }
  console.log('KV SET', kvKey, updatedTableSnippets)
  await kv.set(kvKey, updatedTableSnippets)

  // Save to Postgres.
  // await sql`DROP TABLE IF EXISTS ${tableName};`;
  // await sql`CREATE TABLE `


  return updatedTableSnippets
}
