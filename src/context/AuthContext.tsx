import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { auth, firebase, db_firestore } from '../services/firebase'

import avatarImg from '../assets/image/avatar.svg'
import { ReactNode } from 'react'


interface User {
    uid: string;
    name: string | null;
    avatar: string | null
}

interface AuthContextProviderProps {
    children: ReactNode;
}

interface ICreateAccountWithEmailPassword {
    email: string,
    password: string,
    username: string
}
interface IAuthContextProps {
    user: User | undefined
    setUser: Dispatch<SetStateAction<User | undefined>>;
    singIn: ()=>void ;
    singInWithEmailPassword: (email: string, password: string) => Promise<{ sucess: boolean, code?: string }>;
    createAccountWithEmailPassWord: ({email, password, username}: ICreateAccountWithEmailPassword)=>void;
    singOut: ()=>void
}

export const AuthContext = createContext({} as IAuthContextProps)

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [ user, setUser ] = useState<User>()

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
                        const userData = (await db_firestore.collection('users').doc(uid).get()).data()
                        const userAvatar = await userData?.photoURL
            
                        setUser({
                            uid: uid,
                            name: userData?.userName,
                            avatar: userAvatar || avatarImg
                        })
                    }
                }
            }
            getUserInfo()
        })

        return () => unsubscribe()
    }, [])

    async function singIn() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider()

            const result = await auth.signInWithPopup(provider)

            if ( result.user ) {
                const { displayName, photoURL, uid} = result.user
                await db_firestore.collection('users').doc(uid).set({userName: displayName, photoURL})
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

    async function singInWithEmailPassword( email: string, password: string) {

        try {
            const result = await auth.signInWithEmailAndPassword( email, password)
        
            if ( result.user ) {
                const { uid } = result.user

                const userData = (await db_firestore.collection('users').doc(uid).get()).data()
                const userAvatar = await userData?.photoURL
    
                setUser({
                    uid: uid,
                    name: userData?.userName,
                    avatar: userAvatar || avatarImg
                })
            }

            return {
                sucess: true
            }
        } catch (error: any) {
            console.log(error)
            return {
                sucess: false,
                code: error.code
            }
        }
    }

    async function createAccountWithEmailPassWord( {email, password, username}: ICreateAccountWithEmailPassword ){       
        try {
            const result = await auth.createUserWithEmailAndPassword( email, password )

            if (result.user) {
                const { uid } = result.user 
    
                await db_firestore.collection('users').doc(uid).set({userName: username, photoURL: avatarImg})
    
                const userName = await db_firestore.collection('users').doc(uid).get()

                const name = userName.data()
    
                setUser({
                    uid: uid,
                    name: name?.userName,
                    avatar: avatarImg
                })
            }

            return {
                sucess: true
            }
        } catch (error: any) {
            return {
                sucess: false,
                code: error.code
            }
        }
    }

    async function singOut () {
        await auth.signOut()
    }

    return (
        <AuthContext.Provider value={{user, setUser, singIn, singInWithEmailPassword, createAccountWithEmailPassWord, singOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}