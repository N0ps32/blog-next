export default function Card({children}) {
    return (
        <div className="rounded-sm bg-white shadow-md overflow-hidden">
            {children}
        </div>
    );
}
