import Image from 'next/image';
import Card from '../layout/card';
import Link from 'next/link';
import {FunctionComponent} from 'react';

interface PostWrapperProps {
    publishDate: string;
    postImage: string;
    tags: Array<string>;
}

function renderDate(publishDate?: string) {
    if (!publishDate) {
        return <div />;
    }

    return (
        <div className="flex items-center">
            <Image alt="calendar icon" className="text-white" src="/assets/img/icons/calendar.svg" width="15px" height="15px"/>
            <span className="pl-2">{publishDate}</span>
        </div>
    );
}

function renderTags(tags: Array<string>) {
    return <div className="px-6">
        <hr className="border-gray"/>
        <div className="py-5 flex justify-end">
            {tags.map(tag =>
                <Link href={`/tag/${tag}`} key={tag}>
                    <a className="hover:underline bg-blue text-white rounded-md text-sm py-1 px-2 ml-2">{tag}</a>
                </Link>
            )}
        </div>
    </div>;
}

export const PostWrapper: FunctionComponent<PostWrapperProps> = ({postImage, tags, publishDate, children}) => {
    return (
        <div className="pb-5 sm:pb-7">
            <Card>
                <Image
                    src={postImage}
                    width={1000}
                    height={280}
                    alt="Post header image"
                    className="rounded-t-sm"
                    quality="90"
                />
                {children}
                {tags.length > 0 ? renderTags(tags) : ''}
                <div
                    className="rounded-b-sm bg-blue text-white text-sm flex justify-between items-center leading-4 px-3 py-2 h-9">
                    {renderDate(publishDate)}
                    <div className="flex items-center">
                        <Image alt="user icon" className="text-white" src="/assets/img/icons/user.svg" width="15px" height="15px"/>
                        <span className="pl-2">Written by Benjamin Räder</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
