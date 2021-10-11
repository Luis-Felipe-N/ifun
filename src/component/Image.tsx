import '../style/component/image.scss'

interface ImageProps {
    src: string
}


export function Image(props: ImageProps) {
    const { src } = props
    if (src) {
        return (
            <img alt="meme" {...props} />
        )
    } else {
        return (
            <div className="skeleton">
            </div>
        )
    }
}
