import { ICard } from '../types';
import { Api, ApiListResponse } from './base/Api';

export class CatalogApi extends Api {
	constructor(baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
	}

  getData(): Promise<ApiListResponse<ICard>> {
    return this.get<ApiListResponse<ICard>>(`/product`)
  }
}
