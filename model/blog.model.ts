import mongoose,{Schema} from "mongoose";

const blogSchema = new Schema({
    title : String,
    description : String,
    image : {
        filename: String,
        data: Buffer,
        mimetype:String,
        url:String
    }
});

const Blog = mongoose.model("blog",blogSchema);

export interface BlogBody{
    title : string,
    description : string,
    image : {
        filename: string,
        data: Buffer,
        mimetype:string,
        url:string
    }
}

export default Blog;