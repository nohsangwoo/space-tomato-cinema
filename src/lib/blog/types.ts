export type BlogPostStatus = "draft" | "published";

export type BlogContentBlock =
  | {
      type: "lead" | "heading" | "paragraph" | "quote";
      text: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "list";
      items: string[];
    };

export type BlogPostSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type BlogPost = {
  slug: string;
  status: BlogPostStatus;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  seo: BlogPostSeo;
  content: BlogContentBlock[];
};
