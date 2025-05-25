import { FilterQuery, HydratedDocument, Model, UpdateQuery } from 'mongoose';

export abstract class BaseAbstractRepository<T> {
	constructor(private readonly model: Model<T>) {}

	create(data: Partial<T>): Promise<HydratedDocument<T>> {
		const createdDocument = new this.model(data);
		return createdDocument.save() as Promise<HydratedDocument<T>>;
	}

	findOne(query: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
		return this.model.findOne(query);
	}

	findOneAndIncludePass(query: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
		return this.model.findOne(query).select('+password');
	}

	async updateOne(filter: FilterQuery<T>, query: UpdateQuery<T>): Promise<boolean> {
		const result = await this.model.updateOne(filter, query);
		return result.modifiedCount > 0;
	}

	deleteMany(query: FilterQuery<T>) {
		return this.model.deleteMany(query);
	}
}
