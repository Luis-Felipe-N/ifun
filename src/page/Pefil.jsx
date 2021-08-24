import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Header } from "../component/Header"
import { Card } from "../component/Card"
import { useAuth } from "../hooks/useAuth"
import { useMeme } from "../hooks/useMeme"

import '../style/page/perfil.scss'

// import { FaEdit } from "react-icons/fa";

export function Perfil() {
    
    const {memes} = useMeme()
    const { user } = useAuth()
    const params = useParams()
    const userId = params.id
    const [ memesUser, setMemesUser ] = useState()

    useEffect(() => {
        if ( memes ) {
            const parsedMeme = memes.filter( meme => meme.author.uid === userId)
            setMemesUser(parsedMeme)
        }
    }, [memes, userId])

    return (
        <div className="perfil">
            <Header/>
            <section className="perfil__info">
                <div className="container__img-perfil">
                    <img className="perfil__info-img" alt="Imagem de perfil do usuário" src={user.avatar} />
                </div>
                <h2>{ user.name } </h2>
                <div className="perfil__info-conquest">
                    <h2>Memes: {memesUser && memesUser.length }</h2>
                </div>
            </section>
            <main className="perfil__memes">

            {memesUser &&
                memesUser.map( meme => (<Card key={meme.key} meme={meme} />))
            }
            </main>
        </div>
    )
}