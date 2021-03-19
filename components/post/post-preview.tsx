import {PostPreview as Preview} from '../../lib/server/posts';
import {PostWrapper} from './post-wrapper';
import {Component} from 'react';
import Link from 'next/link';

interface PostPreviewProps {
    post: Preview;
}

export default class PostPreview extends Component<PostPreviewProps> {

    constructor(props: PostPreviewProps) {
        super(props);
    }

    private renderButton(): JSX.Element {
        if (!this.props.post.slug) {
            return (
                <div className="pb-6">
                    <Link href="/">
                        <a className="button">TAKE ME HOME</a>
                    </Link>
                </div>
            );
        }

        return (
            <div className="pb-6">
                <Link href={`/post/${this.props.post.slug}`}>
                    <a className="button">READ POST</a>
                </Link>
            </div>
        );
    }

    render() {
        let {post} = this.props;
        return (
            <PostWrapper tags={post.tags} publishDate={post.publishDate} postImage={post.postImage}>
                <div className="pt-3 px-6">
                    <h1 className="h1 pb-6 link">
                        <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </h1>
                    <div className="pb-6" dangerouslySetInnerHTML={{__html: post.teaserText}}/>
                    {this.renderButton()}
                </div>
            </PostWrapper>
        );
    }

}
