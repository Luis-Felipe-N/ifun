import { useEffect, useRef, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from "../hooks/useAuth";
import { useClickOutSide } from "../hooks/useClickOutSide";
import { db } from "../services/firebase";

import '../style/component/card.scss'

import { FiThumbsUp } from "react-icons/fi";
import { AiOutlineMessage } from 'react-icons/ai'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { TiDeleteOutline } from 'react-icons/ti'

import avatarImg from '../assets/image/avatar.svg'

export function Card( props ) {
    const { user } = useAuth()
    const { clickOutSide } = useClickOutSide()
    const { meme } = props

    const inputComment = useRef()
    const cardHeaderModalRef = useRef()

    const [ newComment, setNewComment ] = useState()
    const [ comments, setComments ] = useState([])
    const [ likesCount, setLikesCount ] = useState()
    const [ likeId, setLikeId ] = useState(false)
    const [ openModalComments, setOpenModalComments ] = useState(false)
    const [ cardHeaderModalIsOpen, setCardHeaderModalIsOpen ] = useState(false)


    useEffect(() => {
        if (cardHeaderModalIsOpen) {
            clickOutSide(cardHeaderModalRef.current, cardHeaderModalIsOpen, setCardHeaderModalIsOpen)
        }
    }, [cardHeaderModalIsOpen])

    async function handleSendCommet( id, e ) {
        e.preventDefault()

        if ( !user.uid ) {
            toast.warn("Somente usuário logado!")
            return
        }

        if( !newComment || !newComment.trim() ) {
            return
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

    const handleViewHeaderModal = () => {
        setCardHeaderModalIsOpen(!cardHeaderModalIsOpen)
    }
    
    const deleteComment = async (keyComment) => {
        console.log(keyComment)
        try {
            await db.ref(`memes/${meme.id}/comments/${keyComment}`).remove()
        } catch (error) {
            
        }
    }

    return (
        <div className="meme">
            <div className="meme__header">
                { meme && <span>{meme.author.name}</span>}
                <button onClick={handleViewHeaderModal}><BiDotsVerticalRounded /></button>
                <div ref={cardHeaderModalRef} className={`meme__header_modal ${cardHeaderModalIsOpen && 'active'}`}>
                    <a href={meme.url} download>Baixar meme</a>
                </div>
            </div>
            <img className="meme__img" src={meme.url} alt="Meme"/>
            <section className="meme__footer">
                <section className="meme__btn">
                        { comments && 
                            <button 
                                className="btn-view-comment" 
                                onClick={ handleViewComments }
                            >
                                { openModalComments ? <AiOutlineMessage color="#FAC463" /> :  <><AiOutlineMessage />  <span>{comments.length}</span></>  }
                            </button>
                        }
                        <button 
                            disabled={!user.uid} 
                            onClick={ handleLikeMeme } 
                            className={`btn-like ${ likeId ? 'isLiked' : ''}`} 
                        >
                            { likesCount && <span>{likesCount.length}</span>}
                            <FiThumbsUp />
                        </button>

                </section>
                { user.uid && (
                     <form 
                        className="meme__input" 
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
                    {
                        comments && openModalComments && comments.map( comment => (
                        <div className="comment" key={comment.key}>
                            <div className="comment__user">
                                <article>
                                    <img src={ comment.author.avatar || avatarImg } alt="imagem do avatar"/>
                                    <span> {comment.author.name} </span>
                                </article>
                                { user.uid === comment.author.uid && <button onClick={() => deleteComment(comment.key)}>
                                    <TiDeleteOutline color="#e4717a" />
                                </button>}
                            </div>
                            <span className="meme-content">{comment.content}</span>
                        </div>))
                    }
            </section>
            <ToastContainer />
        </div>
    )
}