import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Header } from "../component/Header"
import { useMeme } from "../hooks/useMeme"

import '../style/page/perfil.scss'
import { CardPerfil } from "../component/CardPerfil"
import { getUser } from "../utils/firebase"
import { Image } from "../component/Image"


export function Perfil() {
    const { memes }= useMeme()
    const params = useParams()
    const userId = params.id
    const [ memesByUser, setMemesByUser ] = useState()
    const [ user, setUser ] = useState({})

    useEffect(() => {
        if ( memes ) {
            const parsedMeme = memes.filter( meme => meme.author.uid === userId)
            setMemesByUser(parsedMeme)
        }
    }, [memes, userId])

    useEffect(() => {
        const getUserInEffect = async () => {
            const userParsed = await getUser(userId)
            setUser(userParsed)
        }
        getUserInEffect()
    }, [userId])
    
    return (
        <div className="perfil">
            <Header/>
            <section className="perfil__info">
                {user && (
                    <>
                        <div className="container__img-perfil">
                            <Image src={user?.photoURL} />
                        </div>
                        <h2>{ user?.userName } </h2>
                    </>
                )}
                <div className="perfil__info-conquest">
                    <h2>Memes: {memesByUser && memesByUser.length }</h2>
                </div>
            </section>
            <main className="perfil__memes">

                {memesByUser &&
                    memesByUser.map( meme => (<CardPerfil key={meme.key} meme={meme} />))
                }
            </main>
        </div>
    )
}