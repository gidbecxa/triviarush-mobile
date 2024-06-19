import { TrendingArticle } from './types';

const ARTICLES_DATA: Omit<TrendingArticle, 'content'>[] = [
    {
        id: 1,
        resourceId: 'espresso-dance-challenge',
        title: 'Espresso dance challenge',
        href: '/discovery/[article]', // OR /discovery/discovery-one
        description: 'This tune by Sabrina Carpenter is the song of summer!',
        image: { uri: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D' },
        tags: ['TikTok', 'Dance', 'New'],
        // content in separate file, to be loaded separately
    },
    {
        id: 2,
        title: '\'Barbara’s Rhubarb Bar\' dance challenge',
        resourceId: 'barbars-rhubarb-dance-challenge',
        href: '/discovery/[article]', // OR /discovery/discovery-two
        description: '\'Barbaras Rhabarberbar\', is a trending German rap song on TikTok.',
        image: { uri: 'https://images.unsplash.com/photo-1495791185843-c73f2269f669?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFuY2UlMjBjaGFsbGVuZ2V8ZW58MHx8MHx8fDA%3D' },
        tags: ['TikTok', 'Dance', 'Top Choice'],
    },
    {
        id: 3,
        resourceId: 'rock-paper-scissors-food-challenge',
        title: '\'Rock, paper, scissors, shoot\' food challenge',
        href: '/discovery/[article]', // OR /discovery/discovery-three
        description: 'Grab some burgers, fries and a friend to join you in this viral TikTok food challenge.',
        image: { uri: 'https://images.unsplash.com/photo-1564759224907-65b945ff0e84?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGVhdGluZ3xlbnwwfHwwfHx8MA%3D%3D' },
        tags: ['TikTok', 'Game', 'Food'],
    },
];

export default ARTICLES_DATA;