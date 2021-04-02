import path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import {GrayMatterFile} from 'gray-matter';
import matter from 'gray-matter';
import lunr from 'lunr';

export interface ParsedPost {
    meta: {
        description: string,
        tags: string,
    },
    postImage: string,
    postTitle: string,
    publishDate: string,
    tags: Array<string>,
    teaserText: string;
    content: string,
    slug: string,
}

export interface PostPreview {
    title: string;
    teaserText: string;
    postImage: string;
    slug: string;
    publishDate: string;
    tags: Array<string>,
}

export interface SearchData {
    index: string;
    references: Array<PostPreview>;
}

export const PAGE_SIZE = 5;
const filenameRegex = /([a-zA-Z0-9-_]+)\.md$/;
let postsDirectory = path.join(process.cwd(), 'content/posts/');

function setPostsDirectory(newPath: string) {
    postsDirectory = path.join(process.cwd(), newPath);
}

function getAllMdPaths(): Array<string> {
    return glob.sync(path.join(postsDirectory, '**/*.md')).reverse();
}

function parseMd(path: string): ParsedPost {
    const content = fs.readFileSync(path).toString('utf8');
    const parsedContent: GrayMatterFile<string> = matter(content);

    return {
        ...parsedContent.data,
        content: parsedContent.content,
        slug: path.match(filenameRegex)[1],
    } as ParsedPost;
}

function postToPreview(post: ParsedPost): PostPreview {
    return {
        title: post.postTitle,
        teaserText: post.teaserText,
        postImage: post.postImage,
        slug: post.slug,
        publishDate: post.publishDate,
        tags: post.tags,
    };
}

export function getSearchData(): SearchData {
    // read all documents
    const documents: Array<ParsedPost> = getAllMdPaths().map(parseMd);

    // search references to show results
    const searchReferences: Array<PostPreview> = documents.map(postToPreview);

    // build index
    const index = lunr(function () {
        this.ref('slug');
        this.field('postTitle');
        this.field('content');
        documents.forEach(doc => this.add(doc));
    });

    return {
        index: JSON.stringify(index),
        references: searchReferences,
    }
}

export function getAllSlugsAsParams() {
    return getAllMdPaths()
        .map(filename => ({
            params: {
                id: filename.match(filenameRegex)[1],
            },
        }));
}

export function getAllTags(): Array<string> {
    return getAllMdPaths()
        .map(parseMd)
        .reduce((acc, post) => {
            post.tags.forEach(tag => {
                if (!acc.includes(tag)) {
                    acc.push(tag);
                }
            });
            return acc;
        }, []);
}

export function findAllPostPreviews(): Array<PostPreview> {
    return getAllMdPaths()
        .map(parseMd)
        .map(postToPreview);
}

export function findPostPreviewsByTag(tag: string): Array<PostPreview> {
    return getAllMdPaths()
        .map(parseMd)
        .filter(post => post.tags.includes(tag))
        .map(postToPreview);
}

export function findPostBySlug(slug: string): ParsedPost {
    const filePaths = getAllMdPaths()
        .map(filename => filename.match(filenameRegex))
        .filter(match => match[1] === slug)
        .map(match => match.input);

    return parseMd(filePaths[0]);
}

export function findNumberOfPages(): number {
    return Math.ceil(getAllSlugsAsParams().length / PAGE_SIZE);
}

export function findPaginatedPostPreviews(page: number): Array<PostPreview> {
    const realPage = page - 1;
    return getAllMdPaths()
        .slice(realPage * PAGE_SIZE, (realPage * PAGE_SIZE) + PAGE_SIZE)
        .map(parseMd)
        .map(postToPreview);
}
