import { useRef, useEffect } from 'react'
import { memo } from 'react'
import { Link } from 'react-router-dom'
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
        <span ref={pageEndRef}>Acobou os memes :( <Link to="create"><a>Que tal criar o seu?</a></Link></span>
        </>   
    )
}

export const InfiniteScroll = memo(InfiniteScrollComponent)
