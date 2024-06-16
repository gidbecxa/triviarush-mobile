// trending.ts
import { TrendingArticle } from './types';

const TRENDING_ARTICLES: TrendingArticle[] = [
    {
        id: 'trending-one',
        title: 'Espresso dance challenge',
        href: '/trending/[content]', // OR /trending/trending-one
        description: 'This tune by Sabrina Carpenter is the song of summer!',
        image: { uri: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D' },
        tags: ['TikTok', 'Dance', 'New'],
        content: [
            {
                type: 'text',
                content: 'This tune by Sabrina Carpenter is the song of summer! The catchy chorus comes with fun choreography, that\'s taken over TikTok. There are beginner-friendly and advanced versions of her steps making the rounds on TikTok.',
                style: { fontWeight: 'bold', color: '#ff0000' },
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D',
            },
            {
                type: 'link',
                content: 'Join the challenge!',
                href: 'https://www.tiktok.com/explore',
                style: { color: '#0000ff' },
            },
            // More content blocks...
        ],
    },
    {
        id: 'trending-two',
        title: '\'Barbara’s Rhubarb Bar\' dance challenge',
        href: '/trending/[content]', // OR /trending/trending-two
        description: '\'Barbaras Rhabarberbar\', is a trending German rap song on TikTok.',
        image: { uri: 'https://images.unsplash.com/photo-1495791185843-c73f2269f669?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D' },
        tags: ['TikTok', 'Dance', 'Top Choice'],
        content: [
            {
                type: 'text',
                content: '\'Barbaras Rhabarberbar\', is a trending German rap song on TikTok. It translates to \'Barbara\'s Rhubarb Bar\' and has its origins in a classic German tongue-twister. Join in the trend by the music duo Bodo Wartke and Marty Fischer by grabbing your best friend',
                style: { fontWeight: 'bold', color: '#ff0000' },
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1495791185843-c73f2269f669?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D',
            },
            {
                type: 'link',
                content: 'Join the challenge!',
                href: 'https://www.tiktok.com/explore',
                style: { color: '#0000ff' },
            },
            // More content blocks...
        ],
    },
    {
        id: 'trending-three',
        title: '\'Rock, paper, scissors, shoot\' food challenge',
        href: '/trending/[content]', // OR /trending/trending-three
        description: 'Grab some burgers, fries and a friend to join you in this viral TikTok food challenge.',
        image: { uri: 'https://images.unsplash.com/photo-1564759224907-65b945ff0e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGVhdGluZ3xlbnwwfHwwfHx8MA%3D%3D' },
        tags: ['TikTok', 'Game', 'Food'],
        content: [
            {
                type: 'text',
                content: 'Grab some burgers, fries and a friend to join you in this viral TikTok food challenge. In this challenge, whoever wins the game of rock, paper and scissors must eat the food, while the loser must run a lap and be back for the next game. Do this until the food runs out or till one of the players surrenders! This food challenge is usually done outdoors like in a parking lot or park.',
                style: { fontWeight: 'bold', color: '#ff0000' },
            },
            {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1564759224907-65b945ff0e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGVhdGluZ3xlbnwwfHwwfHx8MA%3D%3D',
            },
            {
                type: 'link',
                content: 'Gget inspired by this viral TikTok!',
                href: 'https://www.tiktok.com/explore',
                style: { color: '#0000ff' },
            },
            // More content blocks...
        ],
    },
    // More articles...
];

export default TRENDING_ARTICLES;

/* import { ImageSourcePropType } from 'react-native';

export interface TrendingArticle {
  id: string;
  title: string;
  href: string;
  description: string;
  image: ImageSourcePropType;
  tags: string[];
  content: string;
}

export const trendingArticles: TrendingArticle[] = [
  {
    id: 'article-1',
    title: 'Article 1 Title',
    href: '/trending/article-1',
    description: 'Article 1 description',
    image: { uri: 'https://example.com/article-1.jpg' },
    tags: ['tag1', 'tag2'],
    content: `
      <h1>Article 1 Title</h1>
      <p>This is the <b>content</b> of Article 1. It can contain <a href="https://example.com">links</a>, <i>italics</i>, <span style="color: red;">colored text, and more.</p>
      <p>You can also include images:</p>
      <img src="https://example.com/image.jpg" alt="Example Image" />
    `,
  },
  // Add more articles here
]; */

