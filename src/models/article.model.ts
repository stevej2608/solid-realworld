import { Profile } from "./profile.model";

// https://github.com/gothinkster/angular-realworld-example-app/blob/main/src/app/core/models/article.model.ts

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}
