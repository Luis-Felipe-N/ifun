import { db } from "../services/firebase"


export function getLikes(memeId: string, setLikes: any) {
    const memeRef = db.ref(`memes/${memeId}/likes/`)

    memeRef.on('value', (value, key) => {
        const paserdLikesCount = Object.entries(value.val() || {})
        .map( ([key, {id}]: any) => {
            return {
                id, key
            }
        })
        setLikes( paserdLikesCount )
        
    })
    
    return () => {
        memeRef.off('value')
    }
}
