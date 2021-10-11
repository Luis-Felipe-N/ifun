import { useHistory } from "react-router-dom"

import { formatName } from "../utils/formatName"

import '../style/component/user.scss'

export function User({user}: any ) {
    const history = useHistory()

    const handleEnterUser = () => {
        history.push('/user/' + user.uid)
    }


    if ( user ) {
        return (
            <button onClick={handleEnterUser} className="user">
                <img src={user.avatar} alt={`Imagem perfil Usuario ${user.name}`}/>
                <span>{formatName(user.name)}</span>
            </button>
        )
    } else {
        return null
    }

}