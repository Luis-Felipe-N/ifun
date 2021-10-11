import '../style/component/cardPerfil.scss'
import { AiFillMessage ,AiFillLike } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import { getLikes } from '../utils/firebase'

interface Meme {
    url: string,
    id: string
}

interface MemeProps {
    meme: Meme
}

export function CardPerfil(props: MemeProps) {
    const [ likes, setLikes ] = useState([])

    useEffect(() => {
        getLikes(props.meme.id, setLikes)
    }, [props.meme])

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
                            { likes && <span>{likes.length}</span>}
                        </span>
                    </div>
                </div>
            </div>
    )
}