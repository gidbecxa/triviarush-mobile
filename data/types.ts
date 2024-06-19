// model for article content
export interface ContentBlock {
  type: 'title' | 'subtitle' | 'paragraph' | 'image' | 'link' | 'footnote';
  content: string;
  style?: {
    fontStyle?: 'italic' | 'normal';
    fontWeight?: 'bold' | 'normal';
    color?: string;
    fontSize?: number;
  };
  href?: string;
}

// model for article metadata
export interface TrendingArticle {
  id: number;
  resourceId: string; // Human-readable ID or slug
  title: string;
  href: string;
  description: string;
  image: string;
  tags: string[];
  content?: ContentBlock[]; // To conform to the JSON schema in data/schema/contentSchema.json
}

// model for an item under a section, on the home  - item could be a category or a resource e.g content
export interface SectionItem {
  id: number;
  resourceId?: string;
  categoryId?: string;
  title: string;
  href: string;
  description?: string;
  illustration?: React.ReactNode;
  image?: string;
  tags?: string[];
  label?: string;
}
