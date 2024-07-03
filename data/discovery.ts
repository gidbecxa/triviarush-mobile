import { TrendingArticle } from './types';

const ARTICLES_DATA: Omit<TrendingArticle, 'content'>[] = [
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
        id: 3,
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
        id: 4,
        resourceId: "reels-visual-replies",
        title: "Instagram Reels Visual Replies",
        href: '/discovery/[article]', // OR /discovery/discovery-three
        description: "A fun and engaging way to interact with your audience on Instagram.",
        image: "https://techcrunch.com/wp-content/uploads/2021/12/instagram-reels-replies.jpeg?resize=1536,776",
        tags: [
            "TikTok",
            "Instagram",
            "Beauty"
        ],
    },
];

export default ARTICLES_DATA;