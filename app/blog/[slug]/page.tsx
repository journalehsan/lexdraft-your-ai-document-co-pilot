import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | LexDraft Blog`,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <article>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
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

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full text-sm hover:bg-primary/10 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <MDXRemote source={post.content} />
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
