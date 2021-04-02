import React from 'react';
import Card from '../layout/card';
import Image from 'next/image';

export default function SocialIcons() {
    return (
        <Card>
            <div className="px-4 py-4 flex">
                <a title="Follow me on Github" className="inline-block leading-4 hover:opacity-80"
                   href="https://github.com/N0ps32/" target="_blank" rel="noopener">
                    <Image alt="GitHub" src="/assets/img/icons/github.png" width={50} height={50}/>
                </a>
                <a title="Subscribe via RSS" className="pl-2 inline-block leading-4 hover:opacity-80"
                   href="/rss/posts.rss" target="_blank" rel="noopener">
                    <Image alt="RSS" src="/assets/img/icons/rss.png" width={50} height={50}/>
                </a>
            </div>
        </Card>
    );
}
