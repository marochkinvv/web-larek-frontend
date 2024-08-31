// Интерфейс данных карточки товара
export interface ICard {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number;
  isInCart: boolean;
  inCartNumber?: number;
  button?: string;
}

// Интерфейс данных заказа
export interface IOrder {
  address: string;
  email: string;
  phone: string;
  payment: 'online' | 'offline';
  orderState: {};
  checkValidationPayment(data: string): boolean;
  checkValidationAddress(data: string): boolean;
  checkValidationEmail(data: string): boolean;
  checkValidationPhone(data: string): boolean;
}

// Интерфейс каталога карточек товаров (например, для Главной страницы)
export interface ICatalog {
  _cards: ICard[];
  getCard(cardId: string): ICard | undefined;
}

// export type TCardCartInfo = Pick<ICard, 'id' | 'title' | 'price'>;

// export type TOrderPaymentInfo = Pick<IOrder, 'payment' | 'address'>;

// export type TOrderContactsInfo = Pick<IOrder, 'email' | 'phone'>;

export enum ECardCategory {
  soft = 'софт-скил',
  hard = 'хард-скил',
  other = 'другое',
  additional = 'дополнительное',
  button = 'кнопка',
}

export type TCardCategory = keyof typeof ECardCategory;
