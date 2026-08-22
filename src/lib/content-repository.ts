import { fileManager } from '@/lib/file-manager';
import { parseDataArray } from '@/lib/api-utils';
import type { Album } from '@/data/albums';
import type { Project } from '@/data';
import type { Post } from '@/lib/posts';

export interface Chatter {
  slug: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
  mood?: string;
  cover?: string;
}

export interface Friend {
  id: number;
  name: string;
  url: string;
  avatar: string;
  description: string;
  themeColor: string;
}

function parseResourceArray<T>(content: string, declaration: string, label: string): T[] {
  const data = parseDataArray(content, declaration);
  if (!data) {
    throw new Error(`${label} 数据格式无效`);
  }
  return data as T[];
}

export async function getProjects(): Promise<Project[]> {
  const content = await fileManager.readFile('src/data/index.ts');
  return parseResourceArray<Project>(content, 'projectsData', '项目');
}

export async function getChatters(): Promise<Chatter[]> {
  const content = await fileManager.readFile('src/data/chatters.ts');
  return parseResourceArray<Chatter>(content, 'chattersData', '碎语');
}

export async function getFriends(): Promise<Friend[]> {
  const content = await fileManager.readFile('src/data/friends.ts');
  return parseResourceArray<Friend>(content, 'friendsData', '友链');
}

export async function getAlbums(): Promise<Album[]> {
  const content = await fileManager.readFile('src/data/albums.ts');
  return parseResourceArray<Album>(content, 'albums', '相册');
}

export function getPhotoCount(albums: Album[]): number {
  return albums.reduce((total, album) => total + album.photos.length, 0);
}

export function getRecentPostsFrom(posts: Post[], limit = 4): Post[] {
  return posts.slice(0, limit);
}
