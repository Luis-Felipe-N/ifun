export interface IAuthor {
    avatar: string;
    name: string;
    uid: string;
}

export interface IComment {
    author: IAuthor;
    content: string;
    key: string
}

export interface IMeme {
    id: string;
    url: string;
    author: IAuthor;
    // comments: IComment[];
    hashtags: string
}