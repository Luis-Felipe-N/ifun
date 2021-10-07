import { useEffect, useState } from 'react'

import { useMeme } from '../hooks/useMeme'

import { Card } from '../component/Card'
import { Header } from '../component/Header'

import '../style/page/home.scss'


export function Home() {
    const {memes} = useMeme()
    const [ currentMemes, setCurrentMemes ] = useState()
    const categories = [ 'filmes', 'animes', 'series', 'games', 'politica', 'esportes', 'estudos', 'tecnologias', 'all']
    
    useEffect(() => {
        setCurrentMemes(memes)
    }, [memes])


    const handleViewMeme = ({ target }) => {
        const categorieValue = target.getAttribute('value')
        if ( categorieValue === 'all' ) {
            setCurrentMemes(memes)
        } else {
            const memeByCategories = memes.filter( meme => meme.hashtags.includes( categorieValue ))
            setCurrentMemes(memeByCategories)
        }
    }

    return (
        <div className="home">
            <Header/>
            <main className="home__main">
                <section className="container__memes">
                    {
                        currentMemes?.length ? (
                            currentMemes.map( meme => 
                            (<article key={meme.id}>
                                <Card meme={meme} />
                            </article>)
                            )
                        ) : (
                            <h1 className="container__meme-carregando">...Carregando</h1>
                        )
                    }

                </section>
                <aside className="menu-categorias">
                    <h3>Categorias</h3>
                    <ul>
                        { categories.map( categorie => (
                            <li key={categorie}>
                                <button 
                                    onClick={ handleViewMeme } 
                                    value={categorie}
                                >
                                        {`#${categorie}`}
                                </button>
                            </li>)) }
                    </ul>
                </aside>
               
            </main>
        </div>
    )
}