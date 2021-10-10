import { useRef, useEffect } from 'react'
import { memo } from 'react'
import { Card } from '../component/Card'

function InfiniteScrollComponent({memes}) {
    // const [ page, setPage ] = useState(1)

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

export const InfiniteScroll = memo(InfiniteScrollComponent)
