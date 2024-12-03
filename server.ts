import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from the browser folder
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y', // Cache for 1 year
      index: false, // Disable serving index.html directly
    })
  );

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**', (req, res, next) => {
    const { originalUrl, baseUrl } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: originalUrl, // Pass the full requested URL
        publicPath: browserDistFolder, // Folder containing client assets
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.status(200).send(html))
      .catch((err) => {
        console.error('Error during SSR rendering:', err);
        next(err); // Pass the error to Express
      });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
