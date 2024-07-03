import ARTICLES_DATA from "../discovery";
// import { loadArticleContent } from "./contentLoader";
import { ContentBlock, TrendingArticle } from "../types";

/**
 * Logic to fetch content by articleId 
 * local file import method
 */
export async function fetchContentById(articleId: string): Promise<ContentBlock[]> {
    console.log('Content ID: ', articleId);
    try {
        const articles = await import('../../assets/content/content.json');
        const content = articles[articleId];
        // const content = articles.default[articleId];
        if (!content) {
            throw new Error(`Content not found for articleId: ${articleId}`);
        }
        return content;
    } catch (error) {
        console.error('Error loading content file:', error);
        throw error;
    }
}


/**
 * API call approach
 */
export async function fetchContentAPI(articleId: string): Promise<ContentBlock[]> {
    try {
        // Assume an endpoint or direct URL to access your JSON content
        const response = await fetch(`https://yourdomain.com/content/${articleId}.json`);
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error fetching content:', error);
        throw error;
    }
}

/* export const getDiscoveryArticle = (articleId: string): TrendingArticle | null => {
    const articleMetaData = ARTICLES_DATA.find((article) => article.articleId === articleId);
    if (!articleMetaData) {
        throw new Error(`Article with id ${articleId} not found`);
        return null;
    }
    const content = loadArticleContent(articleId);
    return {
        ...articleMetaData,
        content
    };
}; */

/* export async function fetchContentById(articleId: string): Promise<ContentBlock[]> {
    const articleMetaData = ARTICLES_DATA.find((article) => article.articleId === articleId);
    if (!articleMetaData) {
        throw new Error(`Article with id ${articleId} not found`);
    }
    return loadArticleContent(articleId);
} */