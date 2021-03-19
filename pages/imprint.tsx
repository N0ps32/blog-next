import Layout from '../components/layout/layout';
import Head from 'next/head';
import {getTitle} from '../lib/util';
import Card from '../components/layout/card';

export default function Imprint() {
    return (
        <Layout>
            <Head>
                <title>{getTitle('Imprint')}</title>
                <meta name="description" content="My personal Blog. Topics include Programming, Linux, Networking, Languages, Books and Politics."/>
                <meta name="keywords" content="benjamin,räder,raeder, benjamin räder,programming,programmieren,server,linux,administration,tutorial"/>
            </Head>
            <div className="mb-3">
                <Card>
                    <div className="py-6 px-7">
                        <h1 className="h1">Imprint</h1>
                        <table className="text-sm table-auto mt-4">
                            <tbody>
                            <tr className="border-b border-gray-middle">
                                <td>Name</td>
                                <td className="py-5 pl-2">Benjamin Räder</td>
                            </tr>
                            <tr className="border-b border-gray-middle">
                                <td>Address (Wohnort)</td>
                                <td className="py-5 pl-2">Vienna, Austria</td>
                            </tr>
                            <tr className="border-b border-gray-middle">
                                <td>E-Mail</td>
                                <td className="py-5 pl-2">
                                    <a className="link" href="mailto:blog@raeder.technology">blog@raeder.technology</a>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-middle">
                                <td>Basic direction of my websites content</td>
                                <td className="py-5 pl-2">
                                    Everything on this site is my personal opinion and doesn't follow any particular
                                    political direction. Opinions are my own and don't reflect the opinion
                                    of my current or future employers. I reserve the right to edit and change any of my
                                    articles without prior notification. I try to keep the content of this blog as
                                    up-to-date and accurate as possible. I cannot be held liable for any damage you
                                    might cause to your or any other system by following the content listed on this website.
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <h2 className="h2 mt-10 mb-5">Privacy policy</h2>
                        <p className="mb-5">
                            I don't capture or process any personal information. My website is only accessible using HTTPS
                            if my website is ever served in HTTP there's a good change your web traffic is being intercepted.
                        </p>
                    </div>
                </Card>
            </div>
        </Layout>
    )
}
