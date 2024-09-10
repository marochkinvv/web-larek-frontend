import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

// Интерфейс заказа
interface IOrderView {
  cardButton: HTMLButtonElement;
  cashButton: HTMLButtonElement;
  submitButton: HTMLButtonElement;
  addressInput: HTMLInputElement;
  errors: HTMLElement;
}

export class Order extends Component<IOrderView> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected submitButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected errors: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      '.button[name=card]',
      this.container
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      '.button[name=cash]',
      this.container
    );

    this.submitButton = ensureElement<HTMLButtonElement>(
      '.button[type=submit]',
      this.container
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      '.form__input[name=address]',
      this.container
    );

    this.errors = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    );

    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit('order: contacts-open');
    });

    this.cardButton.addEventListener('click', () => {
      this.toggleClass(this.cashButton, 'button_alt-active', false);
      this.toggleClass(this.cardButton, 'button_alt-active', true);
      events.emit('order: choose-payment', { data: 'online' });
    });

    this.cashButton.addEventListener('click', () => {
      this.toggleClass(this.cardButton, 'button_alt-active', false);
      this.toggleClass(this.cashButton, 'button_alt-active', true);
      events.emit('order: choose-payment', { data: 'offline' });
    });

    this.addressInput.addEventListener('input', () => {
      let value = this.addressInput.value;
      events.emit('order: address-input', { data: value });
    });
  }

  changeSubmitButtonState(data: boolean) {
    if (data) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'true');
    }
  }

  setAddressError(data: boolean) {
    if (!data) {
      this.setText(this.errors, 'Не указан адрес доставки');
    } else {
      this.setText(this.errors, '');
    }
  }

  resetOrder() {
    this.addressInput.value = '';
    this.changeSubmitButtonState(false);
    [this.cardButton, this.cashButton].forEach((button) => {
      this.toggleClass(button, 'button_alt-active', false);
    });
  }
}

interface IContactsView {
  phoneInput: HTMLInputElement;
  phoneErrors: HTMLElement;
  emailInput: HTMLInputElement;
  emailErrors: HTMLElement;
  submitButton: HTMLButtonElement;
}

export class Contacts extends Component<IContactsView> {
  protected phoneInput: HTMLInputElement;
  protected emailInput: HTMLInputElement;
  protected errors: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.phoneInput = ensureElement<HTMLInputElement>(
      '.form__input[name=phone]',
      this.container
    );

    this.emailInput = ensureElement<HTMLInputElement>(
      '.form__input[name=email]',
      this.container
    );

    this.errors = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    );

    this.submitButton = ensureElement<HTMLButtonElement>(
      '.button[type=submit]',
      this.container
    );

    this.phoneInput.addEventListener('input', () => {
      let value = this.phoneInput.value;
      events.emit('order: input-phone', { data: value });
    });

    this.emailInput.addEventListener('input', () => {
      let value = this.emailInput.value;
      events.emit('order: input-email', { data: value });
    });

    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit('order: send-post');
    });
  }

  setEmailError(data: boolean) {
    if (!data) {
      this.setText(this.errors, 'Укажите email в формате name@domen.ru');
    } else {
      this.setText(this.errors, '');
    }
  }

  setPhoneError(data: boolean) {
    if (!data) {
      this.setText(this.errors, 'Укажите телефон в формате +7 (999) 1234567');
    } else {
      this.setText(this.errors, '');
    }
  }

  changeSubmitButtonState(data: boolean) {
    if (data) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'true');
    }
  }

  resetContacts() {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.changeSubmitButtonState(false);
  }
}
