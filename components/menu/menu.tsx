import Link from 'next/link';
import {Component, Fragment} from 'react';
import Logo from './logo';

interface MenuState {
    menuOpen: boolean;
}

export default class Menu extends Component<any, MenuState> {

    private static MENU_ENTRIES = [
        {url: '/', text: 'Home'},
        {url: '/imprint', text: 'Imprint'},
    ];

    constructor(props) {
        super(props);
        this.state = {menuOpen: false};
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    private toggleMenu() {
        this.setState(state => ({
            menuOpen: !state.menuOpen,
        }));
    }

    render() {
        return (
            <Fragment>
                {/* phones */}
                <header className="block sm:hidden pt-16">
                    <div className="bg-blue text-white w-full h-16 fixed top-0 z-10">
                        <nav
                            className="relative 2xl:container mx-auto flex flex-row items-center justify-center col-span-12 px-3">
                            <a onClick={this.toggleMenu} className="absolute left-0 px-3 fill-current">
                                <title>Open menu</title>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                                </svg>
                            </a>
                            <Logo/>
                        </nav>
                    </div>

                    <div className={this.state.menuOpen ? 'block' : 'hidden'}>
                        <div className="fixed top-0 h-full w-full z-20">
                            <div tabIndex={0} onClick={this.toggleMenu}
                                 className="bg-black bg-opacity-40 h-full w-full z-0 fixed top-0 left-0"/>
                            <div className="animate-slide-right w-60 bg-gray-light h-full z-10 fixed top-0 left-0">
                                <ul className="flex flex-col h-full items-start">
                                    {Menu.MENU_ENTRIES.map(entry => (
                                        <li key={entry.url} className="w-full">
                                            <Link href={entry.url}>
                                                <a className="flex flex-row justify-center items-center w-full h-14">
                                                    <span>{entry.text}</span>
                                                </a>
                                            </Link>
                                        </li>
                                    ))}

                                    {/* hidden menu entry for screen reader */}
                                    <li className="w-full">
                                        <a tabIndex={0} onClick={this.toggleMenu}
                                           className="relative -left-full focus:left-0 flex flex-row justify-center items-center w-full h-14">
                                            <span>Close menu</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                {/* desktop & tablet */}
                <header className="bg-blue text-white hidden sm:block w-full">
                    <nav
                        className="h-16 2xl:container mx-auto flex flex-row items-center justify-between col-span-12 px-3">
                        <Logo/>
                        <ul className="flex flex-row h-full">
                            {Menu.MENU_ENTRIES.map(entry => (
                                <li key={entry.url} className="h-full">
                                    <Link href={entry.url}>
                                        <a className="transition-colors hover:bg-blue-dark h-full flex flex-row items-center px-3">
                                            <span>{entry.text}</span>
                                        </a>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </header>
            </Fragment>
        );
    }

}