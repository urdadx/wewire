import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface ResponseData {
  id: string;
  from: string;
  to: string;
  bid: string;
  ask: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  // Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'src/app');

  // Read the json data file data.json
  const fileContents = await fs.readFile(`${jsonDirectory}/data.json`, 'utf8');

  // Parse Data as JSON
  const res: ResponseData = JSON.parse(fileContents);

  // Return the content of the data file in json format
  return NextResponse.json(res);
}
