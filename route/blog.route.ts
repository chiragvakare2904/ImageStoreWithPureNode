import { IncomingMessage, ServerResponse } from 'http';
import { create, findBlogById, findBlogByTitle, noRoute, remove, show, update } from '../controller/blog.controller';

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {

  if (req.url === '/getBlog' && req.method === 'GET') {
     show(req,res);
  } 

  else if (req.url?.startsWith('/getBlog/') && req.method === 'GET') {
     findBlogById(req,res);
  } 

  else if (req.url?.startsWith('/search/?title=') && req.method === 'GET') {
     findBlogByTitle(req,res);
  } 
  
  else if (req.url === '/blog' && req.method === 'POST') {
     create(req,res);
  }

  else if (req.url?.startsWith('/blog/') && req.method === 'DELETE') {
     remove(req,res);
  }

  else if (req.url?.startsWith('/blog/') && req.method === 'PUT') {
     update(req,res);    
  } 

  else if(req.url?.startsWith('/pages/') && req.method === 'GET'){
     show(req,res);
  }
  
  else{
     noRoute(req,res);
  }
}
