import { IncomingMessage, ServerResponse } from "http";
import Blog, { BlogBody } from "../model/blog.model";
import url from "url";
import * as formidable from "formidable";
import fs from "fs"
// Helper function to handle errors and send responses
async function sendResponse(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

// Get blogs with pagination
export async function show(req: IncomingMessage, res: ServerResponse) {
  try {
    const { page, limit } = url.parse(""+req.url,true).query;
    const skip = page && limit ? (Number(page) - 1) * Number(limit) : 0;
    const query = Blog.find().skip(skip).limit(Number(limit));
    const blogs = await query.exec();
    sendResponse(res, 200, blogs);
  } catch (error) {
    sendResponse(res, 500, { message: 'Internal Server Error' });
  }
}

// Create a new blog
export async function create(req: IncomingMessage, res: ServerResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return sendResponse(res, 500, { error: 'Failed to parse form' });
    }

    const imageFile = files.image;

    if (!imageFile) {
      return sendResponse(res, 400, { error: 'No file uploaded' });
    }

    try {
        const imageBuffer = await fs.promises.readFile(imageFile[0].filepath);
        const base64ImageData = imageBuffer.toString('base64');
        const mimeType = imageFile[0].mimetype;
        const dataURL = `data:${mimeType};base64,${base64ImageData}`;
        await Blog.create({
        title: fields.title[0], 
        description: fields.description[0],
        image: { filename: imageFile.name, data: imageBuffer, mimetype: imageFile[0].mimetype,url:dataURL},
      });
      sendResponse(res, 200, { message: 'Blog created successfully' });
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, { message: 'Internal Server Error' });
    }
  });
}

// Delete a blog by ID
export async function remove(req: IncomingMessage, res: ServerResponse) {
  try {
    const id = req.url?.slice(6);
    await Blog.deleteOne({ _id: id });
    sendResponse(res, 200, { id, message: `Blog of ${id} is deleted` });
  } catch (error) {
    sendResponse(res, 500, { message: 'Internal Server Error' });
  }
}

// Update a blog by ID
export async function update(req: IncomingMessage, res: ServerResponse) {
  const BlogId = req.url?.slice(6);
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return sendResponse(res, 500, { error: 'Failed to parse form' });
    }

    const imageFile = files.image;

    if (!imageFile) {
      return sendResponse(res, 400, { error: 'No file uploaded' });
    }

    try {
      const imageBuffer = await fs.promises.readFile(imageFile[0].filepath);
      const base64ImageData = imageBuffer.toString('base64');
      const mimeType = imageFile[0].mimetype;
      const dataURL = `data:${mimeType};base64,${base64ImageData}`;
      await Blog.findOneAndUpdate({_id : BlogId},{
      title: fields.title[0], 
      description: fields.description[0],
      image: { filename: imageFile.name, data: imageBuffer, mimetype: imageFile[0].mimetype,url:dataURL},
    });
      sendResponse(res, 200, { message: 'Blog updated successfully' });
    } catch (error) {
      console.log(error);
      sendResponse(res, 500, { message: 'Internal Server Error' });
    }
  });
}

// Get a blog by ID
export async function findBlogById(req: IncomingMessage, res: ServerResponse) {
  try {
    const id = req.url?.slice(9);
    const blog  = await Blog.findOne({ _id: id });
    sendResponse(res, 200, blog);
  } catch (error) {
    sendResponse(res, 500, { message: 'Internal Server Error' });
  }
}

// Find a blog by title
export async function findBlogByTitle(req: IncomingMessage, res: ServerResponse) {
  try {
    const title = url.parse(""+req.url, true).query.title;
    const blog = await Blog.findOne({ title });
    sendResponse(res, 200, blog);
  } catch (error) {
    sendResponse(res, 500, { message: 'Internal Server Error' });
  }
}

// Handle undefined routes
export async function noRoute(req: IncomingMessage, res: ServerResponse) {
  sendResponse(res, 404, { message: "No route matched" });
}
