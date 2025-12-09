export interface IRestaurant {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stars: number;
}   

export interface INotes {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}