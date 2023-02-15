import { createServer } from 'http';

createServer((req, res) => {
  res.write('Hello codelang!'+process.env.APP_KEY);
  res.end();
}).listen(process.env.PORT);
