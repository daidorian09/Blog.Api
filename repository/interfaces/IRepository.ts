export interface IRepository <T> {

    find(entity: T): Promise <T[]>

    findOne(id: string): Promise<T>

    create(entity: T): Promise<T>

    update(id: string, entity: T): Promise<T>

    delete(id: string): Promise<T>
}