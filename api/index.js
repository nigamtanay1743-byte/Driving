import serverless from 'serverless-http';
import { createApp } from '../server/src/app.js';
import { bootstrapDatabase } from '../server/src/bootstrap.js';

let handler;

export default async function vercelHandler(req, res) {
  if (!handler) {
    await bootstrapDatabase();
    handler = serverless(createApp());
  }
  return handler(req, res);
}
