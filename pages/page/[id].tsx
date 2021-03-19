import Head from 'next/head';
import Layout from '../../components/layout/layout';
import {
    findNumberOfPages,
    findPaginatedPostPreviews, PostPreview as Preview,
} from '../../lib/server/posts';
import {getTitle} from '../../lib/util';
import PostPreview from '../../components/post/post-preview';
import Link from 'next/link';

interface PostProps {
    posts: Array<Preview>;
    numberOfPages: number;
    page: number;
}

function renderPrevButton(numberOfPages: number, currentPage: number): JSX.Element {
    if (currentPage === 2) {
        return <Link href="/">
            <a className="button">PREVIOUS PAGE</a>
        </Link>;
    }

    return <Link href={`/page/${currentPage - 1}`}>
        <a className="button">PREVIOUS PAGE</a>
    </Link>;
}

function renderNextButton(currentPage: number): JSX.Element {
    return <Link href={`/page/${currentPage + 1}`}>
        <a className="ml-4 button">NEXT PAGE</a>
    </Link>;
}

export default function Page({posts, numberOfPages, page}: PostProps) {
    return (
        <Layout>
            <Head>
                <title>{getTitle()}</title>
                <meta name="description" content="My personal Blog. Topics include Programming, Linux, Networking, Languages, Books and Politics."/>
                <meta name="keywords" content="benjamin,räder,raeder, benjamin räder,programming,programmieren,server,linux,administration,tutorial"/>
            </Head>
            {posts.map(post => (
                <div key={post.slug}>
                    <PostPreview post={post} />
                </div>
            ))}
            <div className="mb-16 flex justify-end">
                {renderPrevButton(numberOfPages, page)}
                {numberOfPages > page && renderNextButton(page)}
            </div>
        </Layout>
    );
}

export async function getStaticProps({params}) {
    return {
        props: {
            posts: findPaginatedPostPreviews(params.id),
            numberOfPages: findNumberOfPages(),
            page: Number(params.id),
        },
    };
}

export async function getStaticPaths() {
    const paths = Array(findNumberOfPages())
        .fill(1)
        .map((_, i) => ({
            params: {
                id: `${i + 1}`,
            },
        }));

    return {
        paths,
        fallback: false,
    }
}
