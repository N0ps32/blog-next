import Search from './search';
import SocialIcons from './social-icons';
import About from './about';

export default function Sidebar() {
    return (
        <div>
            <Search/>
            <div className="py-3">
                <SocialIcons/>
            </div>
            <About/>
        </div>
    );
}
