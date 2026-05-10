import { rewriteContentLinks } from "@/lib/parentContent";

export function WpContent({ html, className = "wp-content" }: { html: string; className?: string }) {
  const safe = rewriteContentLinks(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}
