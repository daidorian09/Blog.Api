export interface IGenericRepository <T> {
    findAll(entity: T): Promise <T[]>

    findById(id: string): Promise<T>

    findOne(predicate?: Object): Promise<T>

    find(predicate? : Object) : Promise <T[]>

    create(entity: T): Promise<T>

    update(id: string, entity: T): Promise<T>

    delete(id: string): Promise<T>
}