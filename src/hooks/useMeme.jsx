import { useContext } from "react"
import { MemeContext } from "../context/MemeContext"

export function useMeme() {
    const memes = useContext(MemeContext)

    return memes
}