import { useEffect, useState } from 'react'

import { useMeme } from '../hooks/useMeme'

import { Header } from '../component/Header'

import '../style/page/home.scss'
// import infiniteScroll from '../component/InfiniteScroll'
import InfiniteScroll from '../component/InfiniteScroll'


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
                        currentMemes ? (
                           currentMemes.length ? (
                               <InfiniteScroll memes={currentMemes} />
                        ) : <h1>Sem memes...</h1>
                        ) : (
                            <h1>...Carregando</h1>
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