import Head from 'next/head';
import {findNumberOfPages, findPaginatedPostPreviews, PostPreview as Preview} from '../lib/server/posts';
import {getTitle} from '../lib/util';
import PostPreview from '../components/post/post-preview';
import Layout from '../components/layout/layout';
import Link from 'next/link';

interface HomeProps {
    posts: Array<Preview>;
    numberOfPages: number;
}

export default function Home({posts, numberOfPages}: HomeProps) {
    return (
        <Layout>
            <Head>
                <title>{getTitle()}</title>
                <meta name="description" content="My personal Blog. Topics include Programming, Linux, Networking, Languages, Books and Politics."/>
                <meta name="keywords" content="benjamin,räder,raeder, benjamin räder,programming,programmieren,server,linux,administration,tutorial"/>
            </Head>
            {posts.map(post => (
                <div key={post.slug}>
                    <PostPreview post={post}/>
                </div>
            ))}
            {numberOfPages > 1 && (
                <div className="mb-16 flex justify-end">
                    <Link href="/page/2">
                        <a className="button">NEXT PAGE</a>
                    </Link>
                </div>
            )}
        </Layout>
    )
}

export async function getStaticProps({params}) {
    return {
        props: {
            posts: findPaginatedPostPreviews(1),
            numberOfPages: findNumberOfPages(),
        },
    };
}
