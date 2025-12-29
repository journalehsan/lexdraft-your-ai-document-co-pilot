import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { Calendar, Tag, ChevronRight } from 'lucide-react';

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="py-20 md:py-32 border-b bg-muted/30">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Blog</h1>
            <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
              Insights, tips, and updates from the LexDraft team
            </p>

            {tags.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 text-sm font-semibold mb-4 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>Popular Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-background border text-muted-foreground hover:text-foreground hover:border-primary/50 rounded-full text-sm cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              {posts.length === 0 ? (
                <p className="text-center text-muted-foreground">No blog posts yet. Check back soon!</p>
              ) : (
                <div className="grid gap-8 md:grid-cols-3">
                  {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group cursor-pointer space-y-4">
                      <div className="aspect-video w-full rounded-xl bg-muted/50 border overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          {post.tags.length > 0 && (
                            <>
                              <span className="text-primary bg-primary/5 px-2 py-0.5 rounded-full">{post.tags[0]}</span>
                              <span>•</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                        <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                        <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                          Read more <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
