import { createContext, useEffect, useState } from "react"
import { db } from "../services/firebase"


export const MemeContext = createContext([])

export function MemeConetextProvider( props ) {

    const [ memes, setMemes ] = useState()

    useEffect(() => {
        async function getMeme() {
            const memeRef = await db.ref('memes/')

            memeRef.on('value', snapshot => {
                const memeParset = Object.entries(snapshot.val() || {}).map( ([key, { url, author, hashtags }]) => {
                    return {
                            id: key,
                            url,
                            author,
                            hashtags
                        }
                })
                setMemes(memeParset)
            })

            return () => {
                memeRef.off('value')
            }
        }

        getMeme()
    }, [])

    return (
        <MemeContext.Provider value={{memes}}>
            { props.children}
        </MemeContext.Provider>
    )
}