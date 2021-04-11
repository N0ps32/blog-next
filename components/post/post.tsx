import {ParsedPost} from '../../lib/server/posts';
import Link from 'next/link';
import Image from 'components/misc/image'
import Markdown, {MarkdownToJSX} from 'markdown-to-jsx';
import {createElement} from 'react';
import {PostWrapper} from './post-wrapper';
import {PrismAsyncLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import darcula from 'react-syntax-highlighter/dist/cjs/styles/prism/darcula';

interface PostProps {
    post: ParsedPost;
}

const isInternalLink = (url: string) => url.match(/^\/.*/) !== null;
const isAnchorLink = (url: string) => url.match(/^#.*/) !== null;

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('sql', sql);

const wrappers = {
    p: (type, props, children) =>
        <div key={props.key} className="px-6 py-2">
            {createElement(type, props, children)}
        </div>,
    pre: (type, props, children) =>
        <div key={props.key} className="py-2 text-sm">
            {createElement(type, props, children)}
        </div>,
    code: (type, props, children) => {
        let lang = '';
        if (props.className) {
            const match = props.className.match(/lang-([a-z]+)/);
            if (match) {
                lang = match[1];
            }
        }

        return createElement(SyntaxHighlighter, {
            ...props,
            language: lang,
            style: darcula,
            className: `px-6-imp py-6-imp my-3 ${props.className}`,
        }, children)
    },
    h1: (type, props, children) =>
        <div key={props.key} className="px-6 py-3 pt-5 h1">
            {createElement(type, props, children)}
        </div>,
    h2: (type, props, children) =>
        <div key={props.key} className="px-6 py-3 pt-5 h2">
            {createElement(type, props, children)}
        </div>,
    h3: (type, props, children) =>
        <div key={props.key} className="px-6 py-3 pt-5 h3">
            {createElement(type, props, children)}
        </div>,
    ol: (type, props, children) =>
        <div key={props.key} className="px-12 py-2">
            {createElement(type, {...props, className: 'list-decimal'}, children)}
        </div>,
    ul: (type, props, children) =>
        <div key={props.key} className="px-12 py-2">
            {createElement(type, {...props, className: 'list-disc'}, children)}
        </div>,
    table: (type, props, children) =>
        <div key={props.key} className="px-6 py-3 pt-5">
            {createElement(type, {...props, className: 'w-full'}, children)}
        </div>,
    tr: (type, props, children) =>
        createElement(type, {...props, className: 'border-b border-gray-middle'}, children),
    td: (type, props, children) =>
        createElement(type, {...props, className: 'py-2'}, children),
    img: (type, props, children) => {
        if (props.height && props.width && props.src) {
            return <div key={props.key}>
                {createElement(Image, {...props}, children)}
            </div>;
        }
        return <div key={props.key} className="px-12 py-2 bg-red text-white h1">
            Error: images must have src, width and height specified!
        </div>
    },
    a: (type, props, children) => {
        if (isInternalLink(props.href)) {
            return <span key={props.key} className="link">
                <Link href={props.href}>{children}</Link>
            </span>
        } else if (isAnchorLink(props.href)) {
            return <span key={props.key} className="link">
                {createElement(type, {...props}, children)}
            </span>
        }

        return <span key={props.key} className="link">
            {createElement(type, {...props, target: '_blank', rel: 'noopener'}, children)}
        </span>
    },
};

const options: MarkdownToJSX.Options = {
    createElement(type, props, children) {
        if (typeof type === 'string' && Object.keys(wrappers).includes(type)) {
            return wrappers[type](type, props, children);
        }

        return createElement(type, props, children);
    },
};

export default function Post({post}: PostProps) {
    return (
        <PostWrapper tags={post.tags} publishDate={post.publishDate} postImage={post.postImage}>
            <div className="pt-3 pb-5">
                <h1 className="h1 px-6 pb-6">{post.postTitle}</h1>
                <div>
                    <Markdown options={options}>{post.content}</Markdown>
                </div>
            </div>
        </PostWrapper>
    );
}
