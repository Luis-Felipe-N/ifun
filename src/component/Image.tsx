import '../style/component/image.scss'

interface ImageProps {
    image: string
}


export function Image(props: ImageProps) {
    const { image } = props
    if (image) {
        return (
            <img alt="meme" src={props?.image} />
        )
    } else {
        return (
            <div className="skeleton">
            skeleton
            </div>
        )
    }
}