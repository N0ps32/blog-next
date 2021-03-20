import Head from 'next/head';
import Sidebar from '../sidebar/sidebar';
import Menu from '../menu/menu';
import {getTitle} from '../../lib/util';

export default function Layout({children}) {
    const woff2Preload = [
        'roboto-v20-latin-ext_latin-300.woff2',
        'roboto-v20-latin-ext_latin-regular.woff2',
        'roboto-v20-latin-ext_latin-700.woff2',
    ];

    return (
        <div className="box-border">
            <Head>
                <title>{getTitle()}</title>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta charSet="utf-8"/>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover"/>
                <meta property="og:image" content="/assets/img/og.jpg"/>
                <meta property="og:image:type" content="image/png"/>
                <meta property="og:image:width" content="1200"/>
                <meta property="og:image:height" content="630"/>
                <meta property="og:type" content="website"/>
                <meta name="theme-color" content="#01579A"/>
                <link rel="shortcut icon" href="/favicon.ico"/>
                {woff2Preload.map(font => <link
                    key={font}
                    rel='preload'
                    as='font'
                    type="font/woff2"
                    crossOrigin="anonymous"
                    href={`/assets/fonts/${font}`}
                />)}
            </Head>
            <Menu/>
            <main className="2xl:container mx-auto grid grid-cols-12 pt-4 font-sans">
                <div className="col-span-12 sm:col-span-9 px-3">
                    {children}
                </div>
                <div className="col-span-12 sm:col-span-3 px-3">
                    <Sidebar/>
                </div>
            </main>
        </div>
    );
}
