import { Link, useHistory } from 'react-router-dom'

import { useClickOutSide } from '../hooks/useClickOutSide'

import { User } from './User'
import { Button } from './Button'

import '../style/component/header.scss'
import logoImg from '../assets/image/logo.svg'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'


export function Header( props ) {
    const history = useHistory()
    const { clickOutSide } = useClickOutSide()
    const { user, setUser } = useAuth()
    const [ memeOpen, setMemuOpen ] = useState(false)


    useEffect(() => {
        if ( memeOpen ) {
            const element = document.querySelector('[data-memu]')
            clickOutSide( element, memeOpen, setMemuOpen )
        }
    }, [memeOpen, clickOutSide])

    const isPerfil = history.location.pathname.startsWith('/user')

    const handleLogin = () => {
        history.push('/login')
    }

    const handleLogOut = () => {
        setUser('')
        
        history.push('/')
    }


    return (
        <header className="header">
            <Link to="/">
                <img className="header__logo" src={ logoImg } alt="Logo do site"/>
            </Link>

            <nav data-memu className={`${memeOpen && 'show'}`}>
                <div className="nav-btns">
                    
                    { user.uid ? (
                        isPerfil ? <Button onClick={ handleLogOut }>Sair</Button> : <User user={user} />
                    ) : <Button  onClick={ handleLogin }>Login</Button> }
                    
                    <Button onClick={() => {history.push('/create/meme')}}> Criar Meme </Button>
                </div>
            </nav>

            <Button className="btn-memu" onClick={ () => {setMemuOpen(true)} }>Memu</Button>
            
        </header>
    )
}