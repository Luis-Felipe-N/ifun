import { useEffect, useRef, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from "../hooks/useAuth";
import { db } from "../services/firebase";

import '../style/component/card.scss'

import { FiThumbsUp } from "react-icons/fi";

import avatarImg from '../assets/image/avatar.svg'

export function Card( props ) {
    const { user } = useAuth()
    const meme = props.meme
    const inputComment = useRef()
    const [ newComment, setNewComment ] = useState()
    const [ comments, setComments ] = useState([])
    const [ likesCount, setLikesCount ] = useState()
    const [ likeId, setLikeId ] = useState(false)
    const [ openModalComments, setOpenModalComments ] = useState(false)

    async function handleSendCommet( id, e ) {
        e.preventDefault()

        if ( !user.uid ) {
            toast.warn("Somente usuário logado!")
        }

        const comment = {
            content: newComment,
            author: user
        }

        try {
            await db.ref(`memes/${id}/comments/`).push(comment)
            setNewComment('')
        } catch (e) {
            setNewComment(e)
        }
    }


    useEffect(() => {
        async function getComments() {
            const memeRef = db.ref(`memes/${meme.id}/comments/`)

            memeRef.on('value', (value, key) => {
                const parsedComment = Object.entries(value.val() || {})
                .map( ([key, {content, author}]) => {
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

        getComments()

        async function getLikes() {
            const memeRef = db.ref(`memes/${meme.id}/likes/`)

            memeRef.on('value', (value, key) => {
                const paserdLikesCount = Object.entries(value.val() || {})
                .map( ([key, {id}]) => {
                    return {
                        id, key
                    }
                })
                setLikesCount( paserdLikesCount )
                
            })
            
            return () => {
                memeRef.off('value')
            }
        }

        getLikes()
    },[meme.id])


    useEffect(() => {
        if ( likesCount ) {
            const l = likesCount.find( ({key, id}) => id === user.uid)
            if (l) {
                setLikeId(l.key)
            } else {
                setLikeId(false)
            }
        }
    }, [likesCount, user.uid])

    const handleLikeMeme = async () => {

        if ( !user.uid ) {
            toast.warn("Somente usuário logado!")
            return
        }

        const likeId = likesCount.find( ({key, id}) => id === user.uid)

        if ( likeId ) {
            await db.ref(`memes/${meme.id}/likes/${likeId.key}`).remove()
        } else {
            await db.ref(`memes/${meme.id}/likes/`).push({
                id: user.uid
            })
        }
    }


    const handleViewComments = () => {
        setOpenModalComments(!openModalComments)
    }


    return (
        <div className="meme">
            <img className="meme__img" src={meme.url} alt="Meme"/>
            <section className="meme__footer">
                <section className="meme__interaction-top">
                    <article>
                        <img src={ meme.author.avatar } alt="imagem usuário"/>
                        <span> {meme.author.name} </span>
                    </article>
                    <div>
                        <button 
                            disabled={!user.uid} 
                            onClick={ handleLikeMeme } 
                            className={`btn-like ${ likeId ? 'isLiked' : ''}`} 
                        >
                            { likesCount && <span>{likesCount.length}</span>}
                            <FiThumbsUp />
                        </button>
                    </div>
                </section>

                { user.uid && (
                     <form 
                        className="meme__interaction-bottom" 
                        onSubmit={ (e) => {handleSendCommet(meme.id, e)}}
                     >
                     <input 
                        ref={inputComment} 
                        onChange={ ({target}) => setNewComment(target.value) } 
                        value={newComment} type="text" 
                        placeholder="Adicione um comentário..."
                     />
                     <button>Publicar</button>
                 </form>
                )}

            </section>

            <section className="container-comments">
                    { comments.length ? 
                        <button 
                            className="btn-view-comment" 
                            onClick={ handleViewComments }
                        >
                            { openModalComments ? ' Ver mais comentários' : `Ver os ${comments.length} comentários` }
                        </button>
                    : <button 
                            onClick={ () => {console.log(inputComment.current.focus())} } 
                            className="btn-view-comment">
                            Seja o primeiro a comentar
                      </button>
                    }

                    {
                        comments && openModalComments && comments.map( comment => (
                        <div className="comment" key={comment.key}>
                            <article>
                                <img src={ comment.author.avatar || avatarImg } alt="i"/>
                                <span> {comment.author.name} </span>
                            </article>
                            <span className="meme-content">{comment.content}</span>
                        </div>))
                    }
            </section>
            <ToastContainer />
        </div>
    )
}