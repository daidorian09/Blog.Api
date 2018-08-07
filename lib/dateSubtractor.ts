const MS_PER_DAY = 1000 * 60 * 60 * 24

export const subtractDate = (expireDate: Date) => {
    const expirationDateInUTCFormat = Date.UTC(expireDate.getFullYear(), expireDate.getMonth(), expireDate.getDate())
    const currentDate = new Date()

    const currentDateInUTCFormat = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())

    return Math.floor(currentDateInUTCFormat - expirationDateInUTCFormat) / MS_PER_DAY < 0
}

