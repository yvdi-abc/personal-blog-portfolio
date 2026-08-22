import { getAllPosts } from "@/lib/posts";
import BlogClient from "./BlogClient";

export default async function Blog() {
  const posts = await getAllPosts();
  return <BlogClient posts={posts} />;
}
