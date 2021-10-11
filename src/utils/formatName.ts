export const formatName = (name: string) => {
    if (name.length > 15) {
        return name.split(' ').splice(0, 2).splice(0).join(' ')
    } 
    return name
}