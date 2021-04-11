interface ImageProps {
    src: string;
    alt: string;
    height: string|number;
    width: string|number;
    className?: string;
}

export default function Image(props: ImageProps) {
    return <img {...props} src={require(`public/assets/img/${props.src}`)} />
}
