import { useState, useEffect } from "react";

import { useAuth } from "../hooks/useAuth";

import { db } from '../services/firebase'

import { Button } from "../component/Button";
import { FilterMeme } from "../component/FilterMeme";
import { Header } from "../component/Header";

import memeExampleImg from '../assets/image/meme-example.png'

import '../style/component/create-meme.scss'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CreateMeme() {
    const { user } = useAuth()

    const [ data, setData] = useState(null)
    const [ template, setTemplate ] = useState( null )
    const [ captions, setCaptions ] = useState([])
    const [ sucessCreateMeme, setSucessCreateMeme ] = useState(false)
    const [ formInvalid, setFormInvalid ] = useState(false)
    const [ hashtag, setHashtag ] = useState()


    useEffect(() => {
        async function getMemes() {
            try {
                const response = await fetch( 'https://api.imgflip.com/get_memes' )
                const responseJson = await response.json()
                
                setData(responseJson.data.memes)
            } catch ( e ){
            }
        }
        getMemes()
      }, [])


    useEffect(() => {
        if (template && !sucessCreateMeme) {
            template.box_count ? setCaptions(Array(template.box_count).fill('')) : setCaptions('')
        }
    }, [template, sucessCreateMeme])


    async function handleCreateMeme( e ) {
        e.preventDefault()


        const formData = new FormData()
        formData.append('template_id', template.id)
        formData.append('username', 'LuisFelipeTv')
        formData.append('password', 'Lu15#17#')
        captions.forEach( ( text, index ) => formData.append(`boxes[${index}][text]`, text))


        try {
            const response = await fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            body: formData })

            const responseJson = await response.json()

            if (!responseJson.success) {
                return setFormInvalid(true)
            }
            
            setTemplate(responseJson.data)
            setSucessCreateMeme(true)
            toast.success('Meme criado!')
        } catch (error) {
            new Error(error) 
        }
    }


    const handleSetCaption = ( event, index ) => {
        const text = event.target.value
        setCaptions(
            captions.map( (caption, indexCaption) => {
                if ( index === indexCaption ) {
                    return text
                } else {
                    return caption
                }
            })
        )
    }


    const handleSetTemplate = id => {
        const meme = data.filter( meme => meme.id === id)
        setTemplate(meme[0])
    }


    const handleDownloadMeme = async () => {
        const a = document.createElement('a')
        a.download = 'meme.jpg'
        a.href = template.url
        a.click()
    }


    const handleSendHashtag = ({target}) => {
        let text = target.value.toLowerCase()
        text = text.split(' ')
        const newText = text.map( text => {
            if ( !text.startsWith('#')) {
                return `#${text}`
            } else {
                return text
            }
        })
        setHashtag(newText.join(' '))
    }


    const handleSubmitMeme = async () => {
        if ( !user ) {
            console.log('Para publicar um meme o usuário precisa estar logado!')
            return
        }

        const meme = {
            url: template.url,
            author : user,
            hashtags: hashtag || ''
        }

        try {
            await db.ref('memes/').push(meme)

            toast.success('Meme publicado!')
        } catch (error) {
            toast.error('Algo de errado!')
        }


        setHashtag('')
    }


    return (
        <>
            <Header isCreateMeme={false} />
            <main className="create-meme">
                <h1>Crie seu propio meme!</h1>
                <div className="create-meme-container">
                    <section className="create-meme__select">
                        { !sucessCreateMeme && (
                            <FilterMeme nameMeme={template?.name}>
                                { data && data.map( meme => {
                                    return <li key={meme.id} onClick={ () => {handleSetTemplate(meme.id)} }>{meme.name}</li>
                                })}
                            </FilterMeme>
                        )}

                        {template ? <img key={template?.id} alt={template?.name} src={template?.url}/> : <img src={memeExampleImg} alt="Meme do pikachu" />}
                    </section>

                   {
                       sucessCreateMeme ? (
                           <div className="container__preview">
                                <div className="container__preview-btns">
                                    <Button onClick={ handleDownloadMeme }>Downloader</Button>                                   
                                    <Button onClick={() => {
                                        setSucessCreateMeme(false)
                                        setTemplate(null)
                                    }}>Criar outro meme</Button>
                                </div>

                                <div className="separator">
                                    ou
                                </div>

                                <div className="container__preview-send">
                                    <input type="text" onChange={ handleSendHashtag } value={hashtag} placeholder="Adicione uma #hashtag"/>
                                    <Button onClick={ handleSubmitMeme }>Publicar</Button>
                                </div>
                           </div>
                       )
                       : (
                        <form className={`create-meme__options ${ formInvalid ? 'form-invalid' : ''}`} onSubmit={ template && handleCreateMeme }>
                            {captions && captions.map( ( any, index ) => {
                                return (<div key={`container__input${index}`}>
                                    <label itemID={`input${index}`}>{'Texto ' + Number(index + 1)}</label>
                                    <input type="text" key={index} onChange={ (event) => handleSetCaption(event , index) } />
                                    {formInvalid && <span className="menssage-error-input">Preencha correntamente os campos!</span>}
                                </div>)
                            })}
                            <Button onClick={ () => formInvalid && setFormInvalid( false )}>Criar meme</Button>
                        </form>
                       )
                   }
                </div>
            </main>
            <ToastContainer />
        </>
    )
}