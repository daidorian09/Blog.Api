export const mapErrorObject = (errorDetail: Array<any>) => {
    return Object.assign({}, ...(errorDetail.map(item => {
        return {
            key: item.context.key,
            value: item.message.replace(/[""]+/g, '')
        }
    })))
}