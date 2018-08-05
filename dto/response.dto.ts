export interface Dictionary {
    key : string

    value : any
}

export class Response {

    public isSuccessful : boolean

    public statusCode : number

    public data : Dictionary

    constructor (isSucessfull : boolean, statusCode : number, data : Dictionary) {
        this.isSuccessful = isSucessfull 
        this.statusCode = statusCode
        this.data = data
    }

}