import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
    return (
        <Link href="/">
            <a>
                <div className="flex flex-row items-center text-2xl">
                    <Image
                        src="/assets/img/logo.png"
                        alt="Site Logo"
                        height={64}
                        width={64}
                    />
                    <span>Benjamin's Blog</span>
                </div>
            </a>
        </Link>
    );
}
