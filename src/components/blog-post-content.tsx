import Image from "next/image";
import type { BlogContentBlock } from "@/lib/blog/types";

type BlogPostContentProps = {
  blocks: BlogContentBlock[];
};

export function BlogPostContent({ blocks }: BlogPostContentProps) {
  return (
    <div className="blog-content">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "lead":
            return (
              <p className="blog-lead" key={`${block.type}-${index}`}>
                {block.text}
              </p>
            );
          case "heading":
            return <h2 key={`${block.type}-${index}`}>{block.text}</h2>;
          case "paragraph":
            return <p key={`${block.type}-${index}`}>{block.text}</p>;
          case "quote":
            return (
              <blockquote key={`${block.type}-${index}`}>
                {block.text}
              </blockquote>
            );
          case "image":
            return (
              <figure className="blog-figure" key={`${block.type}-${index}`}>
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 1120px"
                />
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            );
          case "list":
            return (
              <ul key={`${block.type}-${index}`}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
