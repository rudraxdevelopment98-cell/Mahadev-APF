import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { blogPosts, getPost } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main>
      <PageHeader
        eyebrow={`${post.category} · ${post.readingTime} read`}
        title={post.title}
        crumbs={[{ label: "Insights", href: "/blog" }, { label: post.category }]}
      />

      <article className="container-px pb-20">
        <Reveal>
          <div className="flex items-center gap-4 border-b border-white/10 pb-8 text-sm text-muted">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 font-heading text-gold">
              {post.author.charAt(0)}
            </span>
            <span>
              <span className="text-paper">{post.author}</span>
              <br />
              {formatDate(post.date)}
            </span>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 max-w-2xl space-y-6">
          {post.content.map((para, i) => (
            <Reveal key={i} index={i}>
              <p className="text-lg leading-relaxed text-muted">{para}</p>
            </Reveal>
          ))}
        </div>
      </article>

      {/* More articles */}
      <section className="container-px pb-28 md:pb-36">
        <h2 className="mb-8 font-heading text-2xl font-bold">Keep reading</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {more.map((p, i) => (
            <Reveal key={p.slug} index={i}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-2xl border border-white/10 bg-panel/60 p-6 transition-colors hover:border-gold/40"
              >
                <span className="text-xs uppercase tracking-[0.2em] text-gold">
                  {p.category}
                </span>
                <h3 className="mt-3 font-heading text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
