import { createServer } from 'http';

createServer((req, res) => {
  res.write('Hello codelang!');
  res.end();
}).listen(process.env.PORT);
