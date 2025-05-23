import { FilterQuery, HydratedDocument, Model } from 'mongoose';

export abstract class BaseAbstractRepository<T> {
	constructor(private readonly model: Model<T>) {}

	create(data: Partial<T>): Promise<HydratedDocument<T>> {
		const createdDocument = new this.model(data);
		return createdDocument.save() as Promise<HydratedDocument<T>>;
	}

	findOne(query: FilterQuery<T>): Promise<HydratedDocument<T> | null> {
		return this.model.findOne(query);
	}

	find(query: FilterQuery<T>): Promise<HydratedDocument<T>[]> {
		return this.model.find(query);
	}
}
