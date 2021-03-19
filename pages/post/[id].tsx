import Head from 'next/head';
import Layout from '../../components/layout/layout';
import {getAllSlugsAsParams, findPostBySlug, ParsedPost} from '../../lib/server/posts';
import Post from '../../components/post/post';
import {getTitle} from '../../lib/util';

interface PostProps {
    post: ParsedPost;
}

export default function PostPage({post}: PostProps) {
    return (
        <Layout>
            <Head>
                <title>{getTitle(post.postTitle)}</title>
                <meta name="description" content={post.meta.description}/>
                <meta name="keywords" content={post.meta.tags} />
            </Head>
            <Post post={post}/>
        </Layout>
    );
}

export async function getStaticProps({params}) {
    return {
        props: {
            post: findPostBySlug(params.id),
        },
    };
}

export async function getStaticPaths() {
    const paths = getAllSlugsAsParams();
    return {
        paths,
        fallback: false,
    };
}
