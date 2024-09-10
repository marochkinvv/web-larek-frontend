import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

// Интерфейс заказа
interface ISuccessView {
  closeButton: HTMLButtonElement;
  total: HTMLElement;
}

export class Success extends Component<ISuccessView> {
  protected closeButton: HTMLButtonElement;
  protected total: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );

    this.total = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success: close');
    });
  }

  setTotalValue(data: number) {
    this.setText(this.total, `Списано ${data} синапсов`);
  }
}
