import { useEffect, useRef, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from "../hooks/useAuth";
import { useClickOutSide } from "../hooks/useClickOutSide";
import { db } from "../services/firebase";

import { downloaderImage } from '../utils/saveImage'
import { getLikes } from "../utils/firebase";

import '../style/component/card.scss'

import { FiThumbsUp } from "react-icons/fi";
import { AiOutlineMessage } from 'react-icons/ai'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { TiDeleteOutline } from 'react-icons/ti'

import avatarImg from '../assets/image/avatar.svg'
import { User } from "./User";
import { Image } from "./Image";



export function Card( props ) {
    const { user } = useAuth()
    const { clickOutSide } = useClickOutSide()
    const { meme } = props

    const inputComment = useRef()
    const cardHeaderModalRef = useRef()

    const [ newComment, setNewComment ] = useState()
    const [ comments, setComments ] = useState([])
    const [ likes, setLikes ] = useState()
    const [ likeId, setLikeId ] = useState(false)
    const [ openModalComments, setOpenModalComments ] = useState(false)
    const [ cardHeaderModalIsOpen, setCardHeaderModalIsOpen ] = useState(false)

    useEffect(() => {
        if (cardHeaderModalIsOpen) {
            clickOutSide(cardHeaderModalRef.current, cardHeaderModalIsOpen, setCardHeaderModalIsOpen)
        }
    }, [cardHeaderModalIsOpen, clickOutSide])

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

        
        getLikes(meme.id, setLikes)
    },[meme.id])


    useEffect(() => {
        if ( likes ) {
            const l = likes.find( ({key, id}) => id === user?.uid)
            if (l) {
                setLikeId(l.key)
            } else {
                setLikeId(false)
            }
        }
    }, [likes, user?.uid])

    const handleLikeMeme = async () => {

        if (user) {    
            const likeId = likes.find( ({key, id}) => id === user?.uid)
    
            if ( likeId ) {
                await db.ref(`memes/${meme.id}/likes/${likeId.key}`).remove()
            } else {
                await db.ref(`memes/${meme.id}/likes/`).push({
                    id: user?.uid
                })
            }
        } else {
            toast.warn("Somente usuário logado!")
            return
        }
    }


    const handleViewComments = () => {
        setOpenModalComments(!openModalComments)
    }

    const handleViewHeaderModal = () => {
        setCardHeaderModalIsOpen(!cardHeaderModalIsOpen)
    }
    
    const handleDeleteComment = async (keyComment) => {
        try {
            await db.ref(`memes/${meme.id}/comments/${keyComment}`).remove()
            

        } catch (error) {
            
        }
    }

    const handleDeleteMeme = async memeId => {
        try {
            await db.ref(`memes/${memeId}`).remove()
            toast.success("Meme excluido!.")
        } catch (error) {
            console.log(error)
            toast.warn("Não foi possível deletar o meme.")
        }
    }

    const formatName = name => {
        if (name.length > 15) {
            return name.split(' ').splice(0, 2).splice(' ').join(' ')
        } 
        return name
    }

    const handleDownloadMeme = (imageSrc) => {
        console.log(imageSrc)
        downloaderImage(imageSrc)
    }

    return (
        <div className="meme">
            <div className="meme__header">
                { meme && <User user={meme.author} />}
                <button className="meme__header_btnopenmodal" onClick={handleViewHeaderModal}><BiDotsVerticalRounded /></button>
                <div ref={cardHeaderModalRef} className={`meme__header_modal ${cardHeaderModalIsOpen && 'active'}`}>
                    <button onClick={() => handleDownloadMeme(meme.url)} >Baixar meme</button>
                    {  user?.uid === meme.author.uid && <button onClick={() => handleDeleteMeme(meme.id)} className="meme__header_modal-btndelete">Deletar</button>}
                </div>
            </div>
            {/* <img className="meme__img"  alt="Meme"/> */}
            <Image image={meme.url} />
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
                            onClick={ handleLikeMeme } 
                            className={`btn-like ${ likeId ? 'isLiked' : ''}`} 
                        >
                            { likes && <span>{likes.length}</span>}
                            <FiThumbsUp />
                        </button>

                </section>
                { user?.uid && (
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
                                    <span> {formatName(comment.author.name)} </span>
                                </article>
                                { user?.uid === comment.author.uid && <button onClick={() => handleDeleteComment(comment.key)}>
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