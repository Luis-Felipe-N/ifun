import { ReactNode, useEffect, useRef, useState } from 'react'

import { useClickOutSide } from '../hooks/useClickOutSide'

import { FaAngleDown } from "react-icons/fa";
import '../style/component/filter-meme.scss'

interface FilterMemeProps {
    nameMeme: string
    children: ReactNode
}

export function FilterMeme( props: FilterMemeProps ) {
    const [ openFilter, setOpenFilter ] = useState(false)
    const { clickOutSide } = useClickOutSide()
    

    useEffect(() => {
        if ( openFilter ) {
            const element = document.querySelector('[data-drop]')
            clickOutSide( element, openFilter, setOpenFilter )
        } 
    }, [openFilter, clickOutSide])


    return (
        <div className="filtro-meme">
            <div onClick={() => setOpenFilter(!openFilter)} className="header-filtro">
                <span>{props.nameMeme || 'Selecione uma imagem'}</span>
                <FaAngleDown />
            </div>
            <div data-filter className={`container__meme-name ${openFilter && 'show'}`}>
                <ul className="memes-names" data-drop aria-label="Nome dos memes">
                    {props.children}
                </ul>

            </div>
        </div>
    )
}