import { useHistory } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import '../style/component/user.scss'

export function User() {
    const { user } = useAuth()
    const history = useHistory()

    const handleEnterUser = () => {
        history.push('/user/' + user.uid)
    }

    return (
        <button onClick={handleEnterUser} className="user">
            <img src={user.avatar} alt={`Imagem perfil Usuario ${user.name}`}/>
            <span>{user.name && user.name}</span>
        </button>
    )
}