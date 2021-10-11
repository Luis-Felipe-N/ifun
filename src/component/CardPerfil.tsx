import '../style/component/cardPerfil.scss'
import { AiFillMessage ,AiFillLike } from 'react-icons/ai'

interface Meme {
    url: string
}

interface MemeProps {
    meme: Meme
}

export function CardPerfil(props: MemeProps) {

    

    return (
            <div className="memePerfil"  style={{ backgroundImage:`url(${props.meme.url})` }}>
                <div className="memePerfil__data">
                    <div className="memePerfil__data-icons">
                        <span>
                            <AiFillMessage size="25px" />
                            <span>7</span>
                        </span>
                        <span>
                            <AiFillLike size="25px" />
                            <span>20</span>
                        </span>
                    </div>
                </div>
            </div>
    )
}