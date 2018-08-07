import mongoose from 'mongoose'
import { Singleton, Inject } from "typescript-ioc"
import { IGenericRepository } from './interfaces/genericRepository.interface'

@Singleton
export class GenericRepository <T extends mongoose.Document> implements IGenericRepository <T> {

    @Inject 
    private _model: mongoose.Model <mongoose.Document>

        constructor(schema: mongoose.Model <mongoose.Document>) {
            this._model = schema
        }

    async findAll(entity: T): Promise <T[]> {
        return await this._model.find({}).lean().exec()
    }

    async findById(id: string): Promise <T> {
        return await this._model.findOne({
            _id: id
        }).lean().exec()
    }    

    async find(predicate ? : Object | undefined): Promise <T[]> {
        return await this._model.find(predicate).lean().exec()
    }

    async findOne(predicate? : Object): Promise<T> {
        return await this._model.findOne(predicate).lean().exec()
    }

    async create(entity: T): Promise <T> {
        return await this._model.create(entity).then(newEntity => {
            return newEntity
        }).catch(err => {
            return err
        })
    }
    async update(id: string, entity: T): Promise <T> {
        return await this._model.findByIdAndUpdate({
            _id: id
        }, entity).lean().exec()
    }
    async delete(id: string): Promise < T > {
        return await this._model.findByIdAndRemove({
            _id: id
        }).lean().exec()
    }
}