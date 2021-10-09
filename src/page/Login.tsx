import { Link, useHistory } from 'react-router-dom'

import { Button } from '../component/Button'
import { useAuth } from '../hooks/useAuth'


import logoImg from '../assets/image/logo.svg'
import GoogleIcon from '../assets/image/google-icon.svg'
import loginImg from '../assets/image/login.svg'

import '../style/page/sing.scss'
import { useState } from 'react'

export function Login() {
    const { singIn, singInWithEmailPassword }:any = useAuth()
    const history = useHistory()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ erroPassword, setErroPassword ] = useState('')
    const [ erroEmail, setErroEmail ] = useState('')

    async function handleLogin() {
        await singIn()
        history.push('/')
    }


    async function handleLoginEmailPassword(e: any) {
        e.preventDefault()

        const response = await singInWithEmailPassword(email, password)

        if ( response.sucess ) {
            history.push('/')
        } else {
            console.log(response)
            if ( response.code === 'auth/user-not-found' ) {
                setErroEmail('Usuário não encontrado!')
                setErroPassword('')
            } else if ( response.code === 'auth/wrong-password') {
                setErroPassword('Senha incorreta!')
                setErroEmail('')
            }
        }
    }


    return (
        <div className="sing">
            <aside className="sing__aside">
                <img src={ loginImg } alt=""/>
            </aside>
            <main className="sing__main">
                <div className="container_sing">
                    <img className="logo" src={logoImg} alt="Logo do site"/>
                    <Button onClick={handleLogin}>
                        <img src={GoogleIcon} alt="Icone da Google"/>
                        Logar com Google
                    </Button>

                    <div className="separator">
                        ou
                    </div>
                    <form onSubmit={(e) => handleLoginEmailPassword(e)}>
                        <div className="container__input">
                            <label htmlFor="emailInput">Email:</label>
                            <input type="email" onChange={ ({target}) => setEmail(target.value)} value={email}/>
                            { erroEmail && <span className="erro">{erroEmail}</span> }
                        </div>
                        <div className="container__input">
                            <label htmlFor="passwordInput">Senha:</label>
                            <input type="password" onChange={ ({target}) => setPassword(target.value)} value={password}/>
                            { erroPassword && <span className="erro">{erroPassword}</span> }
                        </div>
                        <Button>
                            Entrar
                        </Button>
                    </form>
                    <span>Não tem uma conta? <Link to="/singup">Cadastre-se</Link></span>
                </div>
            </main>
        </div>
    )
}