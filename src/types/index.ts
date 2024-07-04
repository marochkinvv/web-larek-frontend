// Интерфейс данных карточки товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// Интерфейс данных заказа
export interface IOrder {
	address: string;
	email: string;
	tel: string;
	payment: 'online' | 'offline';
	orderState: 'clear' | 'stepOne' | 'stepTwo' | 'success';
	checkValidationStepOne(
		data: Record<keyof TOrderPaymentInfo, string>
	): boolean;
	checkValidationStepTwo(
		data: Record<keyof TOrderContactsInfo, string>
	): boolean;
	setOrderState(): void;
}

// Интерфейс каталога карточек товаров (например, для Главной страницы)
export interface ICatalog {
	cards: ICard[];
	getCard(cardId: string): ICard;
}

// Интерфейс корзины
export interface ICart {
	cards: TCardCartInfo[];
	getTotalCards(cards: TCardCartInfo[]): number;
	getTotalPrice(cards: TCardCartInfo[]): number;
	addCard(card: TCardCartInfo): void;
	deleteCard(cardId: string): void;
	clearCart(): void;
}

export type TCardCartInfo = Pick<ICard, 'id' | 'title' | 'price'>;

export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;

export type TOrderContactsInfo = Pick<IOrder, 'email' | 'tel'>;
