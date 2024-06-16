import { ImageSourcePropType } from "react-native";

// types.ts
export interface ContentBlock {
  type: 'text' | 'image' | 'link';
  content: string;
  style?: {
    fontStyle?: 'italic' | 'normal';
    fontWeight?: 'bold' | 'normal';
    color?: string;
  };
  href?: string;
}

export interface TrendingArticle {
  id: string;
  title: string;
  href: string;
  description: string;
  image: ImageSourcePropType;
  tags: string[];
  content: ContentBlock[];
}
