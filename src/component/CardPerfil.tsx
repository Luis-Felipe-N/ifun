import '../style/component/cardPerfil.scss'

interface Meme {
    url: string
}

interface MemeProps {
    meme: Meme
}

export function CardPerfil(props: MemeProps) {

    return (
            <div className="memePerfil">
                <img src={props.meme.url} alt="" />
            </div>
    )
}