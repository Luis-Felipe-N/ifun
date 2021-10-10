import { useEffect, useState } from 'react'

import { useMeme } from '../hooks/useMeme'

import { Header } from '../component/Header'
import {InfiniteScroll} from '../component/InfiniteScroll'

import '../style/page/home.scss'


// interface User {

// }

interface MemeProps {
    id: string,
    url: string,
    author: any,
    hashtags: string[]
}


export function Home() {
    const { memes }:any = useMeme()
    const [ currentMemes, setCurrentMemes ] = useState<MemeProps[]>()
    const categories = [ 'filmes', 'animes', 'series', 'games', 'politica', 'esportes', 'estudos', 'tecnologias', 'all']
    
    useEffect(() => {
        setCurrentMemes(memes)
    }, [memes])


    const handleViewMeme = ({ target }: any) => {
        const categorieValue = target.getAttribute('value')
        if ( categorieValue === 'all' ) {
            setCurrentMemes(memes)
        } else {
            const memeByCategories = memes.filter( (meme: any) => meme.hashtags.includes( categorieValue ))
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