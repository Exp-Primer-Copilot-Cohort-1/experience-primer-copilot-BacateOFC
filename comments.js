// Create web server
// Listen on port 3000
// GET /comments
// POST /comments
// DELETE /comments/:id

const http = require('http');
const url = require('url');
const qs = require('querystring');

const comments = [];

const server = http.createServer((req, res) => {
  const method = req.method;
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;
  const id = query.id;

  if (method === 'GET' && path === '/comments') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  } else if (method === 'POST' && path === '/comments') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const parsedBodyObj = qs.parse(parsedBody);
      const comment = {
        id: comments.length,
        content: parsedBodyObj.content
      };
      comments.push(comment);
      res.statusCode = 201;
      res.end(JSON.stringify(comment));
    });
  } else if (method === 'DELETE' && path === `/comments/${id}`) {
    comments.splice(id, 1);
    res.statusCode = 204;
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
