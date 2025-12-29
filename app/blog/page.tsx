import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { getAllPosts, getAllTags } from '@/lib/blog';

export const metadata = {
  title: 'LexDraft Legal & AI Blog - Expert Insights on Document Engineering',
  description: 'Expert insights on AI-powered legal document drafting, modern document engineering, and the future of intelligent writing tools.',
  alternates: {
    canonical: 'https://lexdraft.com/blog',
  },
  openGraph: {
    type: 'website',
    url: 'https://lexdraft.com/blog',
    title: 'LexDraft Legal & AI Blog - Expert Insights on Document Engineering',
    description: 'Expert insights on AI-powered legal document drafting, modern document engineering, and the future of intelligent writing tools.',
    siteName: 'LexDraft',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexDraft Legal & AI Blog - Expert Insights on Document Engineering',
    description: 'Expert insights on AI-powered legal document drafting, modern document engineering, and the future of intelligent writing tools.',
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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-serif text-foreground antialiased selection:bg-blue-900/20 flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container py-16 lg:py-24">
            <header className="mb-20">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 text-blue-900 font-bold text-sm mb-6 tracking-wider">
                  <span className="w-12 h-[1px] bg-blue-900"></span>
                  LEXDRAFT LEGAL & AI INSIGHTS
                  <span className="w-12 h-[1px] bg-blue-900"></span>
                </div>
                <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8 text-blue-950 leading-tight">
                  Expert Perspectives on the Future of <span className="font-semibold text-blue-800">Intelligent Document Engineering</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                  Exploring the intersection of artificial intelligence, legal document drafting, and modern productivity tools for professionals.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">AI-Powered Writing</span>
                  <span className="px-4 py-2 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">Legal Documents</span>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Document Engineering</span>
                  <span className="px-4 py-2 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">WYSIWYG Editing</span>
                </div>
              </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-20">
              <div className="flex-1 min-w-0">
                <div className="divide-y divide-slate-200">
                  {posts.length > 0 ? (
                    posts.map((post) => <BlogCard key={post.slug} post={post} />)
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-slate-500 font-light">No articles found.</p>
                    </div>
                  )}
                </div>
              </div>

              <BlogSidebar tags={tags} popularPosts={posts.slice(0, 4)} />
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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group py-16 first:pt-0 border-b border-slate-200 last:border-0 hover:bg-slate-50/50 -mx-6 px-6 transition-all duration-300">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-light uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <div>
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-3xl md:text-4xl font-light text-blue-950 hover:text-blue-700 transition-colors cursor-pointer mb-4 leading-tight group-hover:translate-x-1 transform duration-300">
              {post.title}
            </h2>
          </Link>
          <p className="text-slate-600 text-lg leading-relaxed mb-6 font-light line-clamp-3">{post.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">{post.author}</span>
              </div>
              <span className="text-slate-400">•</span>
              <span>{formattedDate}</span>
              <span className="text-slate-400">•</span>
              <span>{post.readTime}</span>
            </div>
            <Link 
              href={`/blog/${post.slug}`}
              className="text-blue-700 hover:text-blue-900 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
            >
              Read Article
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function BlogSidebar({ tags, popularPosts }: { tags: string[]; popularPosts: any[] }) {
  return (
    <aside className="hidden lg:block w-96 space-y-12">
      <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 shadow-sm">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-4 tracking-wider">
          <span className="w-6 h-[1px] bg-blue-900"></span>
          SUBSCRIBE
        </div>
        <h3 className="font-light text-2xl text-blue-950 mb-4">LexDraft Legal & AI Insights</h3>
        <p className="text-slate-600 mb-6 leading-relaxed font-light">
          Join legal professionals and document engineers receiving expert insights on AI-powered drafting and modern productivity.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="professional@firm.com"
            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          <button className="w-full bg-blue-900 text-white font-light py-3 rounded-lg text-sm hover:bg-blue-800 transition-colors">
            Subscribe to Insights
          </button>
          <p className="text-xs text-slate-500 text-center">
            Unsubscribe anytime. No spam, ever.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-4 tracking-wider">
          <span className="w-6 h-[1px] bg-slate-400"></span>
          EXPLORE TOPICS
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 8).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-sm transition-all font-light"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {popularPosts.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-6 tracking-wider">
            <span className="w-6 h-[1px] bg-slate-400"></span>
            FEATURED ARTICLES
          </div>
          <div className="space-y-6">
            {popularPosts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block cursor-pointer">
                <div className="flex gap-4">
                  <span className="text-2xl font-light text-blue-900/30 group-hover:text-blue-900/60 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-light text-slate-700 group-hover:text-blue-900 transition-colors leading-tight mb-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-light">{post.readTime}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <h3 className="font-light text-xl mb-4">About LexDraft</h3>
        <p className="text-sm leading-relaxed text-slate-300 mb-4 font-light">
          The AI-powered document co-pilot that combines intelligent drafting assistance with professional-grade editing tools.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm font-light transition-colors"
        >
          Learn more about LexDraft
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
