import Link from 'next/link';
import Image from 'components/misc/image';

export default function Logo() {
    return (
        <Link href="/">
            <a>
                <div className="flex flex-row items-center text-2xl">
                    <Image
                        src="logo.png"
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
