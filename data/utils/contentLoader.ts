/* import fs from "fs";
import path from "path";
import { TrendingArticle } from "../types";

export const loadArticleContent = (articleId: string): TrendingArticle['content'] => {
    const contentPath = path.resolve(__dirname, `../content/${articleId}.json`);
    const rawContent = fs.readFileSync(contentPath, "utf-8");
    return JSON.parse(rawContent).content;
}; */