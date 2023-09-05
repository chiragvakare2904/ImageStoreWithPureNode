import http from 'http';
import { handleRequest } from './route/blog.route';
import { connection } from './database/dbConfig';

const server :  http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(handleRequest);

connection();

const PORT = 3010;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
