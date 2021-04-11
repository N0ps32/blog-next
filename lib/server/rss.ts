import {findAllPostPreviews} from './posts';
import {Feed} from 'feed';
import * as fs from 'fs';

const url = 'https://www.raeder.technology';

export function generateRssFeed() {
    const previews = findAllPostPreviews();
    const feed = new Feed({
        title: 'Benjamin\'s Blog',
        description: 'Benjamin\'s Blog',
        id: url,
        link: url,
        language: 'en',
        favicon: url + 'favicon.ico',
        copyright: 'MIT licenced, Benjamin Räder',
        generator: 'Feed',
        feedLinks: {},
        author: {
            name: 'Benjamin Räder',
            email: 'blog@raeder.technology',
            link: url,
        },
    });

    previews.forEach(preview => {
        feed.addItem({
            title: preview.title,
            id: preview.slug,
            link: `${url}/post/${preview.slug}`,
            description: preview.teaserText,
            content: preview.teaserText,
            author: [
                {
                    name: 'Benjamin Räder',
                    email: 'blog@raeder.technology',
                    link: url,
                },
            ],
            contributor: [],
            date: new Date(preview.publishDate),
            image: `${url}/assets/img/posts/${preview.postImage}`,
        });
    });

    fs.writeFileSync('./public/rss/posts.rss', feed.rss2());
}

generateRssFeed();
