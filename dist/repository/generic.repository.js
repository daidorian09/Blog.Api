"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericRepository {
    constructor(schema) {
        this._model = schema;
    }
    async findAll(entity) {
        return await this._model.find({}).lean().exec();
    }
    async findById(id) {
        return await this._model.findOne({
            _id: id
        }).lean().exec();
    }
    async findOne(predicate) {
        return await this._model.findOne(predicate).lean().exec();
    }
    async create(entity) {
        return await this._model.create(entity).then(newEntity => {
            return newEntity;
        }).catch(err => {
            return err;
        });
    }
    async update(id, entity) {
        return await this._model.findByIdAndUpdate({
            _id: id
        }, entity).lean().exec();
    }
    async delete(id) {
        return await this._model.findByIdAndRemove({
            _id: id
        }).lean().exec();
    }
}
exports.GenericRepository = GenericRepository;
