export function useClickOutSide() {
    const clickOutSide = ( element, state, setState ) => {
        document.addEventListener('click', handleClickOutSide)

        function handleClickOutSide( event ) {
            if (!element.contains(event.target)) {
                setState(!state)
                document.removeEventListener('click', handleClickOutSide)
            }
        }
    }

    return { clickOutSide }
}