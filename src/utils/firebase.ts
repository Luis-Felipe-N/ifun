import { db, db_firestore } from "../services/firebase"


export async function getLikes(memeId: string, setLikes: any) {
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


export async function getComments(memeId: string, setComments: any) {
    const memeRef = db.ref(`memes/${memeId}/comments/`)

    memeRef.on('value', (value, key) => {
        const parsedComment = Object.entries(value.val() || {})
        .map( ([key, {content, author}]: any) => {
            return {
                key,
                content,
                author
            }
        })
        setComments( parsedComment )
        return () => {

        }
    })

    return () => {
        memeRef.off('value')
    }
}

export async function getUser( userId: string ) {
    const user = (await db_firestore.collection('users').doc(userId).get()).data()
    return user
}