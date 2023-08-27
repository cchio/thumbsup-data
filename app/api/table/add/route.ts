import { auth } from '@/auth'
import { getUserKVKey, getUserTableName } from '@/lib/utils'
import { kv } from '@vercel/kv'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import pl from 'nodejs-polars'


export async function POST(req: Request) {
  console.log('Add table payload')
  const userId = '345345'
  /*
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }
  */

  const formData = await req.formData()
  const file: File | null = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  // Write received file to /tmp/
  const fileName = file.name
  const filePath = `/tmp/${fileName}`
  const ab = await file.arrayBuffer()
  const bf = Buffer.from(ab)
  await fs.promises.writeFile(filePath, bf, {
    encoding: 'binary'
  })

  // Load file into polars dataframe
  // Important that the filepath have extension ".tsv", ".csv"
  // or it will think the string is the data.
  const table = pl.readCSV(filePath)
  console.log('SCHEMA', table.schema)

  const tableSample = table.sample(5)
  const tableName = getUserTableName(userId, fileName)
  const tableSnippet = tableSample.writeCSV().toString()
  const kvKey = getUserKVKey(userId, 'tableSnippets')

  // Update KV store.
  const tableSnippets = (await kv.get(kvKey)) || {}
  console.log('KV GET', kvKey, tableSnippets)
  const updatedTableSnippets = {
    ...tableSnippets,
    [tableName]: tableSnippet
  }
  console.log('KV SET', kvKey, updatedTableSnippets)
  // await kv.set(kvKey, updatedTableSnippets)

  // Save to Postgres.
  // Prepare the create table command
  // const tableColDefs = table.schema.fields.map(f => {
  //   return `${f.name} ${fieldTypeToPGType(f.type)}`
  // })
  // const createTableCmd = `
  // CREATE TABLE ${tableName} (
  //   ${tableColDefs.join(',\n    ')}
  // );
  // `
  // console.log('PG CREATE CMD', createTableCmd)
  // const fieldTypeToPGType = (fieldType: string): string => {
  //   // https://github.com/frictionlessdata/tableschema-js#working-with-field
  //   switch (fieldType) {
  //     case 'integer':
  //       return 'BIGINT'
  //     case 'year':
  //       return 'INT'
  //     case 'number':
  //       return 'FLOAT8'
  //     case 'boolean':
  //       return 'BOOL'
  //     case 'object':
  //       return 'JSON'
  //     case 'date':
  //       return 'DATE'
  //     case 'datetime':
  //       return 'TIMESTAMP'
  //     default:
  //       return 'TEXT'
  //   }
  // }
  // await sql`DROP TABLE IF EXISTS ${tableName};`;
  // await sql`${createTableCmd}`
  // await sql`COPY ${tableName}(${table.schema.fields.map(f => f.name)})
  //   FROM 'C:\sampledb\persons.csv'
  //   DELIMITER ','
  //   CSV HEADER;
  // `

  return NextResponse.json({ success: true })
}
