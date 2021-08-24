import { createContext, useEffect, useState } from 'react'
import { auth, firebase, db_firestore } from '../services/firebase'

import avatarImg from '../assets/image/avatar.svg'
import { toast } from 'react-toastify'

export const AuthContext = createContext({})

export function AuthContextProvider(props) {
    const [ user, setUser ] = useState({})


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( (user) => {

            async function getUserInfo() {
                if (user) {
                    const { displayName, photoURL, uid} = user
                    
                    if (user.displayName) {
                        setUser({
                            uid: uid,
                            name: displayName,
                            avatar: photoURL,
                        })
                    } else {
                        const userName = await db_firestore.collection('users').doc(uid).get()

                        setUser({
                            uid: uid,
                            name: userName.data().userName,
                            avatar: avatarImg
                        })
                    }
                }
            }
            getUserInfo()
        })

        return () => {
            unsubscribe()
        }
    }, [])

    async function singIn() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider()

            const result = await auth.signInWithPopup(provider)

            if ( result.user ) {
                const { displayName, photoURL, uid} = result.user
                setUser({
                    uid: uid,
                    name: displayName,
                    avatar: photoURL,
                })
            }
        } catch (error) {
            throw new Error('Email ou senha incorreto')
        }
    }

    async function singInWithEmailPassword( email, password) {

        try {
            const result = await auth.signInWithEmailAndPassword( email, password)
        
            if ( result.user ) {
                const { uid } = result.user

                const userName = await db_firestore.collection('users').doc(uid).get()

                console.log(userName.data().userName)
                setUser({
                    uid: uid,
                    name: userName.data().userName,
                    avatar: avatarImg
                })
            }

            return {
                sucess: true
            }
        } catch (error) {
            return error
        }
    }

    async function createAccountWithEmailPassWord( email, password, username ) {
        
        try {
            const result = await auth.createUserWithEmailAndPassword( email, password )

            if (result.user) {
                const { uid } = result.user 
    
                await db_firestore.collection('users').doc(uid).set({userName: username})
    
                const userName = await db_firestore.collection('users').doc(uid).get()
    
                setUser({
                    uid: uid,
                    name: userName.data().userName,
                    avatar: avatarImg
                })
            }

            return {
                sucess: true
            }
        } catch (error) {
            return error
        }
    }


    return (
        <AuthContext.Provider value={{user, setUser, singIn, singInWithEmailPassword, createAccountWithEmailPassWord }}>
            {props.children}
        </AuthContext.Provider>
    )
}