import mongoose, {
    model
} from 'mongoose'
import {
    IRepository
} from './interfaces/IRepository';


export abstract class BaseRepository <T extends mongoose.Document> implements IRepository <T> {

    private _model: mongoose.Model <mongoose.Document>

    constructor(schema: mongoose.Model < mongoose.Document> ) {
            this._model = schema
    }

    async find(entity: T): Promise < T[] > {
        return await this._model.find({}).lean().exec()
    }

    async findOne(id: string): Promise < T > {
        return await this._model.findOne({
            _id: id
        }).lean().exec()
    }

    async create(entity: T): Promise < T > {
        return await this._model.create(entity).then(newEntity => {
            return newEntity
        }).catch(err => {
            return err
        })
    }
    async update(id: string, entity: T): Promise < T > {
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