import { request } from 'graphql-request';
import { getRoot } from '$lib';
import latestConfessionQuery from './confessionLatest.graphql?raw';
import confessionsPageQuery from './confessionsPage.graphql?raw';
import confessQuery from './confess.graphql?raw';
import getConfessionQuery from './confession.graphql?raw';

export interface Confession {
  id: number;
  content: string;
  createdAt: number;
}

export interface ConfessionsPage {
  metadata: PageMeta;
  items: Confession[];
}

export interface PageMeta {
  page: number;
  pageCount: number;
}

export interface Data {
  latestConfession: Confession;
}

export interface Data0 {
    confessions: ConfessionsPage;
}

export interface Data1 {
    confess: Confession
}

export interface Data2 {
    confession: Confession
}

export async function latestConfession(accessToken: string) {
    const data = await request<Data>(
        `${getRoot()}/graphql`,
        latestConfessionQuery,
        { },
        { Authorization: `Bearer ${accessToken}` }
    );

    return data.latestConfession;
}

export async function confessionsPage(accessToken: string, page: number) {
    const data = await request<Data0>(
        `${getRoot()}/graphql`,
        confessionsPageQuery,
        { page: page },
        { Authorization: `Bearer ${accessToken}` }
    );

    return data.confessions;
}

export async function confess(accessToken: string, content: string): Promise<Confession> {
    const data = await request<Data1>(
        `${getRoot()}/graphql`,
        confessQuery,
        { content: content },
        { Authorization: `Bearer ${accessToken}` }
    );
    
    return data.confess;
}

export async function getConfession(id: number, accessToken: string) {
    const data = await request<Data2>(
        `${getRoot()}/graphql`,
        getConfessionQuery,
        { id: id },
        { Authorization: `Bearer ${accessToken}` }
    );

    return data.confession;
}
