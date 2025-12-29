import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { getAllPosts, getAllTags } from '@/lib/blog';

export const metadata = {
  title: 'LexDraft Blog - Expert Insights on AI-Powered Writing',
  description: 'Expert insights on AI-powered writing, document productivity, and best practices.',
  alternates: {
    canonical: 'https://lexdraft.com/blog',
  },
  openGraph: {
    type: 'website',
    url: 'https://lexdraft.com/blog',
    title: 'LexDraft Blog - Expert Insights on AI-Powered Writing',
    description: 'Expert insights on AI-powered writing, document productivity, and best practices.',
    siteName: 'LexDraft',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexDraft Blog - Expert Insights on AI-Powered Writing',
    description: 'Expert insights on AI-powered writing, document productivity, and best practices.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'LexDraft Blog',
    description: 'Expert insights on AI-powered writing, document productivity, and best practices.',
    url: 'https://lexdraft.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'LexDraft',
      url: 'https://lexdraft.com',
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://lexdraft.com/blog/${post.slug}`,
      datePublished: new Date(post.date).toISOString(),
      description: post.description,
      author: {
        '@type': 'Person',
        name: post.author,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container py-12 lg:py-20">
            <header className="mb-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
                  <span className="w-8 h-[2px] bg-primary"></span>
                  LEXDRAFT INSIGHTS
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                  Knowledge for the future of document engineering.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Expert insights on AI-powered writing, document productivity, and best practices.
                </p>
              </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-16">
              <div className="flex-1 min-w-0">
                <div className="divide-y">
                  {posts.length > 0 ? (
                    posts.map((post) => <BlogCard key={post.slug} post={post} />)
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-muted-foreground">No articles found.</p>
                    </div>
                  )}
                </div>
              </div>

              <BlogSidebar tags={tags} popularPosts={posts.slice(0, 3)} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

function BlogCard({ post }: { post: any }) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group py-12 first:pt-0 border-b last:border-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border"
            >
              {tag}
            </span>
          ))}
        </div>
        <div>
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer mb-3">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed mb-4">{post.description}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{post.author}</span>
          </div>
          <span>•</span>
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}

function BlogSidebar({ tags, popularPosts }: { tags: string[]; popularPosts: any[] }) {
  return (
    <aside className="hidden lg:block w-80 space-y-10">
      <div className="p-6 rounded-xl bg-muted/50 border">
        <h3 className="font-bold mb-4">Subscribe to LexDraft Insights</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get the latest tips, best practices, and updates delivered to your inbox.
        </p>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="email@company.com"
            className="w-full bg-background border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button className="w-full bg-foreground text-background font-medium py-2 rounded-lg text-sm hover:opacity-90 transition-opacity">
            Subscribe
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 6).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1 rounded-full border bg-background hover:bg-accent text-sm transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {popularPosts.length > 0 && (
        <div>
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Most Read</h3>
          <div className="space-y-4">
            {popularPosts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block cursor-pointer">
                <span className="text-xs text-muted-foreground block mb-1">
                  0{i + 1}
                </span>
                <h4 className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
