import { useHistory } from "react-router-dom"

import '../style/component/user.scss'

// interface UserProps {
//     user: {
//         uid: string,
//         name: string,
//         avatar: string
//     }
// }

export function User({user}: any ) {
    const history = useHistory()

    const handleEnterUser = () => {
        history.push('/user/' + user.uid)
    }

    const formatName = (name: string) => {
        if (name.length > 15) {
            return name.split(' ').splice(0, 2).splice(0).join(' ')
        } 
        return name
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