import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { getAllPosts, getPostBySlug, getAllTags, BlogPost } from '@/lib/blog';
import { Calendar, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ShareButtons } from './ShareButtons';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `https://lexdraft.com/blog/${post.slug}`;
  const publishedDate = new Date(post.date).toISOString();

  return {
    title: `${post.title} | LexDraft Blog`,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      publishedTime: publishedDate,
      url,
      title: post.title,
      description: post.description,
      siteName: 'LexDraft',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  const tags = getAllTags();
  const popularPosts = allPosts.slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: 'https://lexdraft.com/og-image.png',
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lexdraft.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
        <Header />

        <main className="flex-1">
          <article className="container mx-auto px-4 py-12 lg:py-20 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 min-w-0">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>

                <header className="mb-12">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.15]">
                    {post.title}
                  </h1>
                  <div className="flex items-center justify-between py-6 border-y flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{post.author}</div>
                        <div className="text-xs text-muted-foreground">Author</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-3xl">
                  <MDXRemote source={post.content} />
                </div>

                <div className="mt-16 pt-8 border-t">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-sm font-bold text-muted-foreground">Share this article:</span>
                    <ShareButtons
                      title={post.title}
                      url={`https://lexdraft.com/blog/${post.slug}`}
                    />
                  </div>
                </div>

                  <div className="p-8 rounded-2xl bg-muted/30 border flex gap-6 flex-col sm:flex-row">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Written by {post.author}</h4>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        Expert insights on AI-powered writing, document productivity, and best practices for
                        modern teams.
                      </p>
                    </div>
                  </div>

                  {relatedPosts.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-bold mb-6">Related Articles</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        {relatedPosts.map((related) => (
                          <Link
                            key={related.slug}
                            href={`/blog/${related.slug}`}
                            className="group p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">
                              {related.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{related.description}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ArticleSidebar post={post} tags={tags} popularPosts={popularPosts} />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

function ArticleSidebar({
  post,
  tags,
  popularPosts,
}: {
  post: BlogPost;
  tags: string[];
  popularPosts: BlogPost[];
}) {
  const headings = post.content
    .match(/^#{2,4}\s+.+$/gm)
    ?.map((heading) => {
      const level = heading.match(/^#{2,4}/)?.[0].length || 2;
      const text = heading.replace(/^#{2,4}\s+/, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { level, text, id };
    }) || [];

  return (
    <aside className="hidden lg:block xl:w-64 shrink-0">
      <div className="sticky top-28 space-y-10">
        {headings.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Table of Contents
            </h4>
            <nav className="space-y-3">
              {headings.map((heading, i) => (
                <a
                  key={i}
                  href={`#${heading.id}`}
                  className={`block text-sm text-muted-foreground hover:text-primary transition-colors ${
                    heading.level === 3 ? 'pl-4' : heading.level === 4 ? 'pl-8' : ''
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
          <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Try LexDraft
          </h4>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Automate your legal drafting with context-aware AI.
          </p>
          <Link
            href="/app"
            className="w-full bg-primary text-primary-foreground text-xs font-bold py-2 rounded-lg hover:opacity-90 inline-flex items-center justify-center"
          >
            Get Started Free
          </Link>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Popular Topics</h4>
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
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Most Read
            </h4>
            <div className="space-y-4">
              {popularPosts.map((p, i) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block cursor-pointer">
                  <span className="text-xs text-muted-foreground block mb-1">
                    0{i + 1}
                  </span>
                  <h4 className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">
                    {p.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
