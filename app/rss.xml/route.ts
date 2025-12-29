import { getAllPosts } from '@/lib/blog';
import RSS from 'rss';

export async function GET() {
  const feed = new RSS({
    title: 'LexDraft Blog',
    description: 'Insights, tips, and updates from the LexDraft team',
    site_url: 'https://lexdraft.com',
    feed_url: 'https://lexdraft.com/rss.xml',
    language: 'en',
    pubDate: new Date(),
  });

  const posts = getAllPosts();

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `https://lexdraft.com/blog/${post.slug}`,
      date: post.date,
      author: post.author,
      categories: post.tags,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
