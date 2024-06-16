import { ImageSourcePropType } from "react-native";

export interface Hashtag {
    key: string;
    value: string;
}

export interface HashtagCategory {
    id: string;
    title: string;
    href: string;
    description: string[];
    illustration: ImageSourcePropType;
    hashtags: Hashtag[];
}

export const hashtagsData: HashtagCategory[] = [
    {
        id: "travel",
        title: "Travel",
        href: "/hashtags/[category]", // "/hashtags/travel",
        description: ["adventure", "explore", "wanderlust", "journey"],
        illustration: require("~/assets/illustrations/travel-alt-svgrepo-com.png"),
        hashtags: [
            { key: "travel1", value: "#ExploreTheWorld" },
            { key: "travel2", value: "#WanderlustLife" },
            { key: "travel3", value: "#TravelDiaries" },
            { key: "travel4", value: "#AdventureAwaits" },
            { key: "travel5", value: "#TravelBug" },
        ],
    },
    {
        id: "fitness",
        title: "Fitness",
        href: "/hashtags/[category]", // "/hashtags/fitness",
        description: ["workout", "health", "active", "motivation"],
        illustration: require("~/assets/illustrations/fitness-colored-svgrepo-com.png"),
        hashtags: [
            { key: "fitness1", value: "#FitFam" },
            { key: "fitness2", value: "#HealthyLifestyle" },
            { key: "fitness3", value: "#NoExcuses" },
            { key: "fitness4", value: "#FitnessMotivation" },
            { key: "fitness5", value: "#StrongIsBeautiful" },
        ],
    },
    //  more categories ...
];
