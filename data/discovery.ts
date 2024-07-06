import { TrendingArticle } from './types';

const ARTICLES_METADATA: Omit<TrendingArticle, 'content'>[] = [
    {
        id: 1,
        resourceId: 'cottage-cheese-trend',
        title: 'Cottage cheese Trend',
        href: '/discovery/[article]', // OR /discovery/discovery-one
        description: 'Cottage cheese is taking the internet by storm, especially on TikTok!',
        image: "https://cdn.pixabay.com/photo/2022/04/18/09/57/cottage-cheese-7140007_1280.jpg",
        tags: [
            "TikTok",
            "Food",
            "Trend"
        ],
        // content in separate file, to be loaded separately
    },
    {
        id: 2,
        resourceId: "sabrina-please-please-please",
        title: "Please, Please, Please",
        href: "/discovery/[article]",
        description: "This trend is all about expressing creativity through dance, lip syncs, and fan edits.",
        image: "https://i.scdn.co/image/ab67616d0000b273de84adf0e48248ea2d769c3e",
        tags: [
            "Instagram",
            "Music",
            "TikTok"
        ],
    },
    {
        id: 3,
        title: 'Red Trend on TikTok 2024',
        resourceId: 'tiktok-red-trend',
        href: '/discovery/[article]', // OR /discovery/discovery-two
        description: 'Embrace the Red Revolution!',
        image: "https://images.pexels.com/photos/1267369/pexels-photo-1267369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        tags: [
            "TikTok",
            "Fashion",
            "Interior Design"
        ],
    },
    {
        id: 4,
        resourceId: "reels-visual-replies",
        title: "Instagram Reels Visual Replies",
        href: '/discovery/[article]', // OR /discovery/discovery-three
        description: "A fun and engaging way to interact with your audience on Instagram.",
        image: "https://techcrunch.com/wp-content/uploads/2021/12/instagram-reels-replies.jpeg?resize=1536,776",
        tags: [
            "Instagram",
            "Reels",
            "Feature"
        ],
    },
    {
        id: 5,
        resourceId: "espresso-dance-challenge",
        title: "The Espresso Dance Challenge",
        href: "/discovery/[article]",
        description: "The latest sensation taking over TikTok is the Espresso Dance Challenge",
        image: "https://i.scdn.co/image/ab67616d0000b273659cd4673230913b3918e0d5",
        tags: [
            "TikTok",
            "Instagram",
            "Dance"
        ],
    },
    {
        id: 6,
        resourceId: "bridgerton-photo-filter-trend",
        title: "Bridgerton Photo Filter",
        href: "/discovery/[article]",
        description: "Step into the Regency era with the Bridgerton Filter on TikTok!",
        image: "https://dnm.nflximg.net/api/v6/BvVbc2Wxr2w6QuoANoSpJKEIWjQ/AAAAQf9Y-D6FTzsO1-KDKw_RKkaOb6omexs-3J3cH5zWuxBXP9IA_CAMOGlMXJM0T93FTBWOpdtvw8cvE_NXBgJKH3zPvR8sV6tMduAHjz7HWkXj1yO2BAe4h0PARj2czKnYHNQWvK1_9diZ_bVIr08tQbQ5XgM.jpg?r=43a",
        tags: [
            "TikTok",
            "Photo",
            "Instagram"
        ],
    },
    {
        id: 7,
        resourceId: "kitty-cut-haircut",
        title: "Kitty Cut Haircut Trend",
        href: '/discovery/[article]', // OR /discovery/discovery-three
        description: "The Kitty Cut is the trending haircut of 2024.",
        image: "https://i.pinimg.com/564x/4c/cf/6f/4ccf6ffa257bd9e8707cd7d2c10ed7a7.jpg",
        tags: [
            "TikTok",
            "Instagram",
            "Beauty"
        ],
    },
    {
        id: 8,
        resourceId: "instagram-ai-backdrop",
        title: "Instagram's AI Backdrop",
        href: "/discovery/[article]",
        description: "Instagram's new AI Backdrop feature brings a fresh and creative way to enhance your story photos with unique, AI-generated backgrounds",
        image: "https://media.licdn.com/dms/image/D4D12AQHbh7Ql1PsFgw/article-cover_image-shrink_720_1280/0/1702642524079?e=2147483647&v=beta&t=S5GetZnvScgKMUgtc_KCFX-LU2_zBK_xmj2hTLsIw0A",
        tags: [
            "Instagram",
            "Feature",
            "Stories"
        ],
    },
    {
        id: 9,
        resourceId: "barbara-rhubarb-dance-challenge",
        title: "Barbara's Rhubarb Bar Trend",
        href: "/discovery/[article]",
        description: "The \"Barbara's Rhubarb Bar\" trend is taking TikTok and other social media platforms by storm!",
        image: "https://e3.365dm.com/24/05/1600x900/skynews-bodo-wartke-marti-fischer_6541877.jpg?20240503160026",
        tags: [
            "TikTok",
            "Dance",
            "Top Choice"
        ],
    },
    {
        id: 10,
        resourceId: "lets-dance-emma-stone",
        title: "Let's Dance",
        href: "/discovery/[article]",
        description: "Grab some burgers, fries and a friend to join you in this viral TikTok food challenge.",
        image: "https://static3.mujerhoy.com/www/multimedia/202401/26/media/cortadas/emma-stone-cambios-look-pelo-kuRH-U2101349567837EqH-1248x1248@MujerHoy.jpg",
        tags: [
            "TikTok",
            "Game",
            "Food"
        ],
    }
];

export default ARTICLES_METADATA;