import Head from 'next/head';
import Layout from '../../components/layout/layout';
import {findPostPreviewsByTag, getAllTags, PostPreview as Preview,} from '../../lib/server/posts';
import {getTitle} from '../../lib/util';
import PostPreview from '../../components/post/post-preview';

interface TagProps {
    posts: Array<Preview>;
}

export default function Tag({posts}: TagProps) {
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
        </Layout>
    );
}

export async function getStaticProps({params}) {
    return {
        props: {
            posts: findPostPreviewsByTag(params.id)
        },
    };
}

export async function getStaticPaths() {
    const paths = getAllTags()
        .map(tag => ({
            params: {
                id: tag,
            },
        }));

    return {
        paths,
        fallback: false,
    }
}
