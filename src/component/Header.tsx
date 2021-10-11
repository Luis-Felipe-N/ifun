import { Link, useHistory } from 'react-router-dom'

import { useClickOutSide } from '../hooks/useClickOutSide'
import { formatName } from '../utils/formatName'

import { Button } from './Button'

import { AiOutlineUser } from 'react-icons/ai'
import { BsBoxArrowRight }  from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'

import '../style/component/header.scss'
import '../style/component/user.scss'
import logoImg from '../assets/image/logo.svg'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'


export function Header( ) {
    const history = useHistory()
    const { clickOutSide } = useClickOutSide()
    const { user, setUser, singOut }:any = useAuth()
    const [ memeOpen, setMemuOpen ] = useState(false)
    const [ openModalMenu, setOpenModalMenu ] = useState(false)

    const modalMenu = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        if ( memeOpen ) {
            const element = document.querySelector('[data-memu]')
            clickOutSide( element, memeOpen, setMemuOpen )
        }
    }, [memeOpen, clickOutSide])

    useEffect(() => {
        if ( openModalMenu ) {
            clickOutSide( modalMenu.current, openModalMenu, setOpenModalMenu)
        }
    },[openModalMenu, clickOutSide])

    const handleOpenModalMenu = () => {
        setOpenModalMenu(!openModalMenu)
    }

    const handleLogin = () => {
        history.push('/login')
    }

    const handleLogOut = () => {
        singOut()
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
                    
                    { user?.uid ? (
                        <>
                       <button onClick={ handleOpenModalMenu } className="user">
                            <img src={user.avatar} alt={`Imagem perfil Usuario ${user.name}`}/>
                            <span>{formatName(user.name)}</span>
                            <IoIosArrowDown />
                       </button>
                       <div ref={modalMenu} className={openModalMenu ? 'modal__perfil active' : 'modal__perfil'}>
                           <Link to={'/user/' + user.uid}>
                            <AiOutlineUser/>Perfil
                           </Link>
                            <button onClick={ handleLogOut }>
                                <BsBoxArrowRight />
                                Sair
                            </button>

                       </div>
                       </>
                    ) : <Button  onClick={ handleLogin }>Login</Button> }
                    
                    <Button onClick={() => {history.push('/create')}}> Criar Meme </Button>
                </div>
            </nav>

            <Button className="btn-memu" onClick={ () => {setMemuOpen(true)} }>Memu</Button>
            
        </header>
    )
}