import { IEvents } from './base/Events';
import { IOrder } from '../types';

export class OrderModel implements IOrder {
  address: string;
  email: string;
  phone: string;
  payment: 'online' | 'offline';

  constructor(protected events: IEvents) {}

  checkValidationPayment(data: 'online' | 'offline'): boolean {
    if (data) {
      this.setPayment(data);
      this.events.emit('order: correct-payment');
    } else {
      return;
    }
  }

  checkValidationAddress(data: string): boolean {
    if (data.length > 0) {
      this.setAddress(data);
      this.events.emit('order: correct-address');
      return true;
    } else {
      this.setAddress(null);
      this.events.emit('order: incorrect-address');
      return false;
    }
  }

  checkValidationEmail(data: string): boolean {
    const emailRegex = /^[A-Z0-9\.\_\%\+\-]+\@[A-Z0-9\-]+\.[A-Z]+$/i;
    if (emailRegex.test(data)) {
      this.setEmail(data);
      this.events.emit('order: correct-email');
      return true;
    } else {
      this.setEmail(null);
      this.events.emit('order: incorrect-email');
      return false;
    }
  }

  checkValidationPhone(data: string): boolean {
    const phoneRegex = /^\+7\s?\((\d{3})?\)\s?(\d{7})$/;
    if (phoneRegex.test(data)) {
      this.setPhone(data);
      this.events.emit('order: correct-phone');
      return true;
    } else {
      this.setPhone(null);
      this.events.emit('order: incorrect-phone');
      return false;
    }
  }

  setPayment(data: 'online' | 'offline') {
    this.payment = data;
  }

  setAddress(data: string) {
    this.address = data;
  }

  setEmail(data: string) {
    this.email = data;
  }

  setPhone(data: string) {
    this.phone = data;
  }

  reset() {
    this.payment = null;
    this.address = null;
    this.email = null;
    this.phone = null;
  }
}
