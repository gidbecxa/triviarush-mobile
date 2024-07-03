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
  stats?: string;
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
  illustration?: string;
  image?: string;
  tags?: string[];
  label?: string;
}

// model for a category, primarily categories for captions and templates
export interface Category {
  id: number;
  slug: string;
  title: string;
  href: string;
  description?: string;
  illustration: string;
  subCategories?: SubCategory[];
  label?: string;
}

// model for a sub-category which serves as a label that any post could identify as
export interface SubCategory {
  id: number;
  slug: string;
  parentId: number;
  title: string;
  href?: string;
  description?: string;   // not relavant atm
  illustration?: string;  // not relavant atm
  label?: string;         // not relavant atm
  tags?: string[];        // experimenting
  captions?: Caption[];
}

export interface Caption {
  id: number;
  value?: string; // the caption
  subCategoryId: number;
  categoryId: number;
}

// model for a hashtag topic
export interface Topic {
  id: number;
  slug: string;
  title: string;
  href: string;
  description?: string;
  illustration: string;
  label?: string;
  hashtags?: Hashtag[];
}

export interface Hashtag {
  id: number;
  value?: string; // the hashtag
  topicId: number;
  stat?: string;
  tag?: string | string[];
}

/**
 * The Algorithm for fetching captions: 
 * Get [an array of] all IDs of sub-categories of a given category [specified by its `id`].
 * Browse through all captions. 
 * Fetch every caption where the `subCategoryId` matches any `id` of the collected sub-categories.
 * An array of all these captions make all captions belonging to a given category
 *  */ 
