import { useRef, useEffect, useState } from 'react'
// import {  } from 'react/cjs/react.development'
import { Card } from '../component/Card'

export default function InfiniteScroll({memes}) {
    const [ page, setPage ] = useState(1)

    const pageEndRef = useRef()
    console.log(memes.length)

    useEffect(() => {
        console.log('Fim da página')
    }, [pageEndRef])

    return (
        <>
        {memes.map( meme => <article key={meme.id}><Card meme={meme} /></article>)}
        <span ref={pageEndRef}>Fim</span>
        </>   
    )
}
