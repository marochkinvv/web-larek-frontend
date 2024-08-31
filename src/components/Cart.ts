import {
  ensureElement,
  cloneTemplate,
  createElement,
} from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter, IEvents } from './base/Events';

// Интерфейс корзины
interface ICartView {
  items: HTMLElement[];
  totalPrice: number;
  totalItems: number;
  cartButton: HTMLButtonElement;
}

export class Cart extends Component<ICartView> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>(
      '.basket__list',
      this.container
    );
    this._price = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order: delivery-open');
      });
    }

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста',
        })
      );
    }
  }

  set totalPrice(value: number) {
    this.setText(
      this._price,
      `${new Intl.NumberFormat('ru-RU').format(value)} синапсов`
    );
  }

  changeButtonState(data: boolean) {
    if (data) {
      this._button.removeAttribute('disabled');
    } else {
      this._button.setAttribute('disabled', 'true');
    }
  }
}
