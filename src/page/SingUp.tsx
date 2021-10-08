import { Link, useHistory } from 'react-router-dom'

import { Button } from '../component/Button'
import { useAuth } from '../hooks/useAuth'


import logoImg from '../assets/image/logo.svg'
import loginImg from '../assets/image/login.svg'

import '../style/page/sing.scss'
import { useState } from 'react'


export function SingUp() {
    const { createAccountWithEmailPassWord }:any = useAuth()
    const history = useHistory()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ userName, setUserName ] = useState('')
    const [ erroPassword, setErroPassword ] = useState('')
    const [ erroEmail, setErroEmail ] = useState('')

    const handleCreateAccont =  async (e: any) => {
        e.preventDefault()

        const response = await createAccountWithEmailPassWord( {email, password, userName} )
        
        if ( response.sucess ) {
            console.log(response)
            history.push('/')
        } else {
            if ( response.code === 'auth/email-already-in-use' ) {
                setErroEmail('Email em uso!')
            } else {
                setErroEmail('')
            }
        }
    }


    const validar = (value: string) => {
        if ( value.length < 6 ) {
            setErroPassword('Crie uma senha com mais de 6 digitos!')
        } else {
            setErroPassword('')
        }
    }


    const handleSetPassword = (value: string) => {
        if ( erroPassword ) validar(value)
        setPassword(value)
    }
    const handleSetEmail = (value: string) => {
        if ( erroEmail ) validar(value)
        setEmail(value)
    }
 

    return (
        <div className="sing">
            <aside className="sing__aside">
                <img src={ loginImg } alt=""/>
            </aside>
            <main className="sing__main">
                <div className="container_sing">
                    <img className="logo" src={logoImg} alt="Logo do site"/>

                    <form onSubmit={(e) => handleCreateAccont(e)}>
                        <div className="container__input">
                            <label htmlFor="userNameInput">Nome de usuário:</label>
                            <input id="userNameInput" type="text" onChange={ ({target}) => setUserName(target.value)} value={userName}/>
                        </div>
                        <div className="container__input">
                            <label htmlFor="emailInput">Email:</label>
                            <input onChange={ ({target}) => handleSetEmail(target.value) } type="email" value={email}/>
                            { erroEmail && <span className="erro">{erroEmail}</span>}
                        </div>
                        <div className="container__input">
                            <label htmlFor="passwordInput">Senha:</label>
                            <input type="password" onBlur={ () => validar(password)} onChange={ ({target}) => handleSetPassword(target.value) } value={password}/>
                            { erroPassword && <span className="erro">{erroPassword}</span>}
                        </div>
                        <Button>
                            Criar conta
                        </Button>
                    </form>
                    <span>Já possui uma conta? <Link to="/login">Faça login</Link></span>
                </div>
            </main>
        </div>
    )
}