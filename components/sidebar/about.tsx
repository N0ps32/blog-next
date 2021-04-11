import React from 'react';
import Card from '../layout/card';
import Image from 'components/misc/image';
import differenceInYears from 'date-fns/differenceInYears';

const years: number = differenceInYears(new Date(), new Date(1995, 5, 15));

export default function About() {
    return (
        <div className="mb-3">
            <Card>
                <div className="rounded-t-sm overflow-hidden relative">
                    <Image alt="About background image" src="sidebar.jpg" width={400} height={250}/>
                    <div className="absolute bottom-0 px-5 py-5 text-white text-2xl font-light">
                        About
                    </div>
                </div>
                <div className="px-7 py-2 text-sm">
                    <p className="py-3">
                        I'm Benjamin a {years} year old programmer from Vienna, Austria. My main focus is web development,
                        hybrid App development and a bit of Linux system administration.
                    </p>
                    <p className="py-3">
                        This blog contains everything I'm interested in. Programming, Linux, Networking, Languages, Books
                        and Politics. Feel free to shoot me a message if you have any questions.
                    </p>
                    <p className="py-3">
                        My blog is open-source and can be found on <a className="link"
                                                                      href="https://github.com/N0ps32/blog-next"
                                                                      target="_blank" rel="noopener">GitHub</a>.
                    </p>
                </div>
                <hr className="border-gray-middle"/>
                <div className="px-7 py-3 text-sm">
                    <a className="link" href="mailto:blog@raeder.technology">
                        CONTACT ME
                    </a>
                </div>
            </Card>
        </div>
    );
}
