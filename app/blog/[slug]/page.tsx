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
    title: `${post.title} | LexDraft Legal & AI Blog`,
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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 font-serif text-foreground antialiased selection:bg-blue-900/20 dark:selection:bg-blue-400/20 flex flex-col">
        <Header />

        <main className="flex-1">
          <article className="container mx-auto px-4 py-16 lg:py-24 max-w-7xl">
            <div className="flex flex-col xl:flex-row gap-20 lg:items-start">
              <div className="flex-1 min-w-0 xl:max-w-4xl">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 mb-8 transition-colors font-light"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Legal & AI Insights
                  </Link>

                <header className="mb-16">
                  <div className="flex flex-wrap gap-3 mb-8">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="text-xs font-light uppercase tracking-wider px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8 leading-[1.1] text-blue-950 dark:text-blue-100">
                    {post.title}
                  </h1>
                  <div className="flex items-center justify-between py-8 border-y border-slate-200 dark:border-slate-700 flex-wrap gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-900 dark:text-blue-300 font-light text-lg">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">{post.author}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-light">Legal & AI Expert</div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-light flex items-center gap-6 flex-wrap">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </header>

                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none font-light prose-headings:font-normal prose-h1:text-3xl prose-h1:text-blue-950 dark:prose-h1:text-blue-100 prose-h2:text-2xl prose-h2:text-blue-900 dark:prose-h2:text-blue-100 prose-h3:text-xl prose-h3:text-blue-800 dark:prose-h3:text-blue-200 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:leading-relaxed prose-a:text-blue-700 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-200 dark:prose-blockquote:border-l-blue-800 prose-blockquote:bg-blue-50/30 dark:prose-blockquote:bg-blue-950/30 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:font-light prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400 prose-strong:text-blue-900 dark:prose-strong:text-blue-100 prose-code:text-blue-700 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/30 prose-code:px-1 prose-code:rounded prose-hr:border-slate-200 dark:prose-hr:border-slate-700">
                  <MDXRemote source={post.content} />
                </div>

                <div className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-sm font-light text-slate-600 dark:text-slate-400">Share this legal & AI insight:</span>
                    <ShareButtons
                      title={post.title}
                      url={`https://lexdraft.com/blog/${post.slug}`}
                    />
                  </div>
                </div>

                <div className="p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900/30 border border-blue-200 dark:border-blue-800 flex gap-8 flex-col sm:flex-row shadow-sm">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-900 dark:text-blue-300 font-light text-2xl shrink-0 shadow-sm">
                    {post.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                     <h4 className="font-light text-2xl mb-3 text-blue-950 dark:text-blue-100">Written by {post.author}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-base mb-4 leading-relaxed font-light">
                      Expert insights on AI-powered legal document drafting, modern productivity tools, and the future of intelligent document engineering for professionals.
                    </p>
                    <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 font-light">
                      <span>• Legal Document Expert</span>
                      <span>• AI Technology Specialist</span>
                      <span>• Productivity Consultant</span>
                    </div>
                  </div>
                </div>

                {relatedPosts.length > 0 && (
                  <div className="mt-20">
                    <div className="flex items-center gap-3 mb-8">
                      <span className="w-8 h-[1px] bg-blue-900 dark:bg-blue-100"></span>
                      <h3 className="text-2xl font-light text-blue-950 dark:text-blue-100">Related Legal & AI Articles</h3>
                      <span className="w-8 h-[1px] bg-blue-900 dark:bg-blue-100"></span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                      {relatedPosts.map((related) => (
                         <Link
                           key={related.slug}
                           href={`/blog/${related.slug}`}
                           className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                         >
                          <h4 className="font-light text-lg group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors line-clamp-2 mb-3 leading-tight">
                            {related.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 font-light leading-relaxed">{related.description}</p>
                          <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-light group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                            Read more
                            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ArticleSidebar post={post} tags={tags} popularPosts={popularPosts} />
            </div>
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
    <aside className="hidden xl:block xl:w-80 shrink-0">
      <div className="sticky top-32 space-y-12">
        {headings.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100 font-light text-sm mb-4 tracking-wider">
              <span className="w-6 h-[1px] bg-blue-900 dark:bg-blue-100"></span>
              CONTENTS
            </div>
            <nav className="space-y-3">
              {headings.map((heading, i) => (
                <a
                  key={i}
                  href={`#${heading.id}`}
                  className={`block text-sm text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-light ${
                    heading.level === 3 ? 'pl-6' : heading.level === 4 ? 'pl-10' : ''
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 dark:from-blue-800 dark:to-slate-800 text-white shadow-lg">
          <div className="flex items-center gap-2 text-blue-200 font-light text-sm mb-3 tracking-wider">
            <CheckCircle2 className="h-4 w-4" />
            TRY LEXDRAFT
          </div>
          <h4 className="font-light text-xl mb-4 text-white">Start Creating Better Documents Today</h4>
          <p className="text-blue-200 text-sm mb-6 leading-relaxed font-light">
            Experience AI-powered legal document drafting with our intelligent WYSIWYG editor.
          </p>
          <Link
            href="/app"
            className="w-full bg-white text-blue-900 font-light py-3 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center justify-center text-sm"
          >
            Get Started Free
          </Link>
          <p className="text-xs text-blue-300 text-center mt-4 font-light">
            No credit card required
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-light text-sm mb-4 tracking-wider">
            <span className="w-6 h-[1px] bg-slate-400 dark:bg-slate-600"></span>
            EXPLORE TOPICS
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 text-sm transition-all font-light text-slate-700 dark:text-slate-300"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {popularPosts.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-light text-sm mb-6 tracking-wider">
              <span className="w-6 h-[1px] bg-slate-400 dark:bg-slate-600"></span>
              MOST READ
            </div>
            <div className="space-y-4">
              {popularPosts.map((p, i) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block cursor-pointer">
                  <div className="flex gap-3">
                    <span className="text-lg font-light text-blue-900/30 dark:text-blue-100/30 group-hover:text-blue-900/60 dark:group-hover:text-blue-100/60 transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-sm font-light text-slate-700 dark:text-slate-300 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors leading-tight">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 shadow-sm">
          <h4 className="font-light text-lg mb-4 text-blue-950 dark:text-blue-100">About LexDraft</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 font-light">
            The AI-powered document co-pilot that combines intelligent drafting assistance with professional-grade WYSIWYG editing tools for modern professionals.
          </p>
          <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 font-light">
            <span>✓ AI-Powered Writing</span>
            <span>✓ Legal Document Templates</span>
            <span>✓ WYSIWYG Editor</span>
            <span>✓ Team Collaboration</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
