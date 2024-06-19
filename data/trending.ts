// trending.ts
import { TrendingArticle } from './types';

const TRENDING_ARTICLES: TrendingArticle[] = [
    {
        id: 1,
        resourceId: 'espresso-dance-challenge',
        title: 'Espresso dance challenge',
        href: '/discovery/[article]', // OR /discovery/discovery-one
        description: 'This tune by Sabrina Carpenter is the song of summer!',
        image: { uri: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D' },
        tags: ['TikTok', 'Dance', 'New'],
        content: [
            {
                type: 'title',
                content: 'Espresso dance challenge',
                style: { fontWeight: 'bold',  },
            },
            {
                type: 'paragraph',
                content: 'The "Espresso Dance Challenge" is the latest craze on TikTok, driven by Sabrina Carpenter\'s catchy summer hit. This challenge is all about fun, easy-to-follow dance moves that anyone can master. Join the trend by learning the simple choreography and adding your own unique twist. Whether you\'re a beginner or a seasoned dancer, this challenge is your chance to shine on social media!.',
                style: { fontWeight: 'normal',  },
            },
            {
                type: 'subtitle',
                content: 'Get Inspired and Join In',
                style: { fontWeight: 'bold',  },
            },
            {
                type: 'paragraph',
                content: 'Watch how top TikTok creators are adding their flair to the dance. Use props like coffee cups or try different settings to make your video stand out. Explore trending hashtags like #EspressoDance and #SabrinaCarpenter to see what others are doing and to get your video noticed.',
                style: { fontWeight: 'normal',  },
            },
            {
                type: 'subtitle',
                content: 'Customize Your Moves',
                style: { fontWeight: 'bold',  },
            },
            {
                type: 'paragraph',
                content: 'Don\'t be afraid to add your personal touch. Whether it’s a cool filter or a creative location, make the dance your own. The key is to have fun and enjoy the process, so grab a friend and start dancing!',
                style: { fontWeight: 'normal',  },
            },
            {
                type: 'subtitle',
                content: 'Connect and Share',
                style: { fontWeight: 'bold',  },
            },
            {
                type: 'paragraph',
                content: 'Post your version of the dance using the trending sounds and tags to reach a wider audience. Engage with other users by liking, commenting, and sharing their videos. This not only boosts your visibility but also helps you connect with the TikTok community.',
                style: { fontWeight: 'normal',  },
            },
            {
                type: 'link',
                content: 'Discover More',
                style: { fontWeight: 'bold', fontSize: 17, },
            },
            {
                type: 'footnote',
                content: 'Keep exploring our Discovery page for the latest trends and challenges. Sociagram is your go-to app for staying updated on what\'s hot and helping you create content that captures attention. Dive in and join the fun!',
                style: { fontWeight: 'normal',  },
            },
            /* {
                type: 'image',
                content: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D',
            },
            {
                type: 'link',
                content: 'Join the challenge!',
                href: 'https://www.tiktok.com/explore',
                style: { color: '#0000ff' },
            }, */
        ],
    },
    {
        id: 2,
        title: '\'Barbara’s Rhubarb Bar\' dance challenge',
        resourceId: 'barbars-rhubarb-dance-challenge',
        href: '/discovery/[article]', // OR /discovery/discovery-two
        description: '\'Barbaras Rhabarberbar\', is a trending German rap song on TikTok.',
        image: { uri: 'https://images.unsplash.com/photo-1495791185843-c73f2269f669?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D' },
        tags: ['TikTok', 'Dance', 'Top Choice'],
        content: [
            {
                type: 'paragraph',
                content: '\'Barbaras Rhabarberbar\', is a trending German rap song on TikTok. It translates to \'Barbara\'s Rhubarb Bar\' and has its origins in a classic German tongue-twister. Join in the trend by the music duo Bodo Wartke and Marty Fischer by grabbing your best friend',
                style: { fontWeight: 'bold',  },
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
        id: 3,
        resourceId: 'rock-paper-scissors-food-challenge',
        title: '\'Rock, paper, scissors, shoot\' food challenge',
        href: '/discovery/[article]', // OR /discovery/discovery-three
        description: 'Grab some burgers, fries and a friend to join you in this viral TikTok food challenge.',
        image: { uri: 'https://images.unsplash.com/photo-1564759224907-65b945ff0e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGVhdGluZ3xlbnwwfHwwfHx8MA%3D%3D' },
        tags: ['TikTok', 'Game', 'Food'],
        content: [
            {
                type: 'paragraph',
                content: 'Grab some burgers, fries and a friend to join you in this viral TikTok food challenge. In this challenge, whoever wins the game of rock, paper and scissors must eat the food, while the loser must run a lap and be back for the next game. Do this until the food runs out or till one of the players surrenders! This food challenge is usually done outdoors like in a parking lot or park.',
                style: { fontWeight: 'bold',  },
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
    href: '/discovery/article-1',
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

