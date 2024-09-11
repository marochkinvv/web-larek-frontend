import { ICard, ICatalog } from '../types';
import { IEvents } from './base/Events';

export class CatalogModel implements ICatalog {
  _cards: ICard[] = [];

  constructor(protected events: IEvents) {}

  // получить карточку из списка (каталога)
  getCard(cardId: string) {
    const currentCard = this._cards.find((card) => card.id === cardId);
    if (currentCard) {
      return currentCard;
    }
  }

  // загрузить карточки в список (каталог)
  setCards(cards: ICard[]) {
    this._cards = cards;
    this.events.emit('cards: changed');
  }

  // изменить состояние карточки "в корзине"
  changeCardInCartParam(cardId: string) {
    const currentCard = this.getCard(cardId);
    if (currentCard) {
      currentCard.isInCart = !currentCard.isInCart;
    }
  }

  // получить список карточек (каталог)
  getCatalog() {
    return this._cards;
  }

  // получить список карточек с состоянием "в корзине"
  getInCart() {
    return this._cards.filter((card) => card.isInCart);
  }

  // получить кол-во карточек с состоянием "в корзине"
  getInCartTotal() {
    return this.getInCart().length;
  }

  // получить общую стоимость карточек с состоянием "в корзине"
  getInCartTotalPrice(): number {
    let totalPrice = 0;
    this.getInCart().forEach((card) => {
      totalPrice += card.price;
    });
    return totalPrice;
  }

  // получить карточку с состоянием "в корзине"
  getCardInCart(cardId: string) {
    const currentCard = this.getInCart().find(
      (card) => card.id === cardId
    );
    if (currentCard) {
      return currentCard;
    }
  }

  // получить индекс карточки с состоянием "в корзине"
  getCardIndexInCart(cardId: string): number {
    if (cardId) {
      console.log(
        this.getInCart().indexOf(this.getCardInCart(cardId))
      );
      return this.getInCart().indexOf(this.getCardInCart(cardId));
    }
  }

  // добавить карточку в начало списка карточек
  addCard(card: ICard) {
    this._cards.push(card);
    this.events.emit('cards: changed');
  }
}
