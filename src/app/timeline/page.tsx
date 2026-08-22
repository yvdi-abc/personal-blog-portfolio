import TimelineClient from '@/components/TimelineClient';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from "@/siteConfig";

export const metadata = {
  title: "归档与探索 | " + siteConfig.title,
};

export default async function TimelinePage() {
  const posts = await getAllPosts();

  // 计算标签统计
  const tagCounts: Record<string, number> = {};
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const tagsArray = Object.keys(tagCounts)
    .map(name => ({ name, count: tagCounts[name] }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen relative pb-32">
      <TimelineClient posts={posts} tags={tagsArray} />
    </div>
  );
}
