import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { Calendar, User, Tag } from 'lucide-react';

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Insights, tips, and updates from the LexDraft team
          </p>

          {tags.length > 0 && (
            <div className="mb-12">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-8">
            {posts.length === 0 ? (
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="border-b pb-8 last:border-b-0">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-3">{post.description}</p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Read more →
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
