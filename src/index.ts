import './scss/styles.scss';
import {
  // TOrderPaymentInfo,
  // TCardCartInfo,
  TCardCategory,
  // TOrderContactsInfo,
} from './types';
import { CatalogModel } from './components/CatalogModel';
import { OrderModel } from './components/OrderModel';
import { CatalogApi } from './components/CatalogApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Page } from './components/Page';
import {
  cloneTemplate,
  createElement,
  ensureElement,
} from './utils/utils';
import {
  Card,
  CardInCartPreview,
  CardCatalogPreview,
  CardModalPreview,
} from './components/Card';
import { Modal } from './components/common/Modal';
import { Cart } from './components/Cart';
import { Order, Contacts } from './components/Order';

const events = new EventEmitter();
const api = new CatalogApi(API_URL);
const catalogModel = new CatalogModel(events);
const orderModel = new OrderModel(events);

// Глобальные контейнеры
const page = new Page(ensureElement('.page'), events);
const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  events
);

// Шаблоны

const cardCatalogPreview = new CardCatalogPreview(
  'card',
  cloneTemplate('#card-catalog'),
  events
);
const cardModalPreview = new CardModalPreview(
  'card',
  cloneTemplate('#card-preview'),
  events
);
const cardInCartPreview = new CardInCartPreview(
  'card',
  cloneTemplate('#card-basket'),
  events
);
const cart = new Cart(cloneTemplate('#basket'), events);
const order = new Order(cloneTemplate('#order'), events);
const contacts = new Contacts(cloneTemplate('#contacts'), events);

api
  .getData()
  .then((data) => {
    catalogModel.setCards(data.items);
  })
  .catch((err) => console.log(err));

events.on('cards: changed', () => {
  const cardsHTMLArray = catalogModel.getCatalog().map((item) => {
    const newCard = new CardCatalogPreview(
      'card',
      cloneTemplate('#card-catalog'),
      events
    );
    return newCard.render({
      image: `${CDN_URL}${item.image}`,
      title: item.title,
      price: item.price,
      category: item.category,
      isInCart: item.isInCart,
      id: item.id,
    });
  });

  page.render({
    counter: catalogModel.getInCartTotal(),
    catalog: cardsHTMLArray,
    locked: false,
  });
});

events.on('card: select', (data: { id: string }) => {
  const currentCardId = Object.values(data).toString();
  const currentCard = catalogModel.getCard(currentCardId);
  const newCard = new CardModalPreview(
    'card',
    cloneTemplate('#card-preview'),
    events
  );
  modal.render({
    content: newCard.render({
      id: currentCard.id,
      description: currentCard.description,
      image: `${CDN_URL}${currentCard.image}`,
      title: currentCard.title,
      price: currentCard.price,
      category: currentCard.category,
      isInCart: currentCard.isInCart,
      button: currentCard.button,
    }),
  });
});

events.on('cart: open', () => {
  const cardsHTMLArray = catalogModel.getInCart().map((item) => {
    const newCard = new CardInCartPreview(
      'card',
      cloneTemplate('#card-basket'),
      events
    );
    return newCard.render({
      title: item.title,
      price: item.price,
      id: item.id,
      isInCart: item.isInCart,
      inCartNumber: catalogModel.getInCart().indexOf(item) + 1,
    });
  });

  modal.render({
    content: createElement<HTMLElement>('div', {}, [
      cart.render({
        items: cardsHTMLArray,
        totalPrice: catalogModel.getInCartTotalPrice(),
      }),
    ]),
  });
});

events.on('card: change-card-state', (data: { id: string }) => {
  const currentCard = Object.values(data).toString();
  catalogModel.changeCardState(currentCard);

  if (catalogModel.getInCart().length > 0) {
    cart.changeButtonState(true);
  } else {
    cart.changeButtonState(false);
  }
});

events.on('order: delivery-open', () => {
  modal.render({
    content: createElement<HTMLElement>('div', {}, [order.render()]),
  });
});

events.on('order: contacts-open', () => {
  modal.render({
    content: createElement<HTMLElement>('div', {}, [
      contacts.render(),
    ]),
  });
});

events.on(
  'order: choose-payment',
  (data: { value: 'online' | 'offline' }) => {
    const paymentValue = Object.values(data).toString() as
      | 'online'
      | 'offline';
    orderModel.checkValidationPayment(paymentValue);
  }
);

events.on('order: address-input', (data: { value: string }) => {
  const inputValue = Object.values(data).toString();
  orderModel.checkValidationAddress(inputValue);
});

events.on('order: correct-payment', () => {
  if (orderModel.address) {
    order.changeSubmitButtonState(true);
    orderModel.getOrderState();
  } else {
    order.changeSubmitButtonState(false);
  }
});

events.on('order: correct-address', () => {
  if (orderModel.payment) {
    order.changeSubmitButtonState(true);
    orderModel.getOrderState();
  } else {
    order.changeSubmitButtonState(false);
  }
});

events.on('order: incorrect-address', () => {
  order.changeSubmitButtonState(false);
});

events.on('order: input-email', (data: { value: string }) => {
  const inputValue = Object.values(data).toString();
  orderModel.checkValidationEmail(inputValue);
});

events.on('order: input-phone', (data: { value: string }) => {
  const inputValue = Object.values(data).toString();
  orderModel.checkValidationPhone(inputValue);
});

events.on('order: correct-email', () => {
  if (orderModel.email) {
    contacts.changeSubmitButtonState(true);
  } else {
    contacts.changeSubmitButtonState(false);
  }
});

events.on('order: incorrect-email', () => {
  contacts.changeSubmitButtonState(false);
});

events.on('order: correct-phone', () => {
  if (orderModel.phone) {
    contacts.changeSubmitButtonState(true);
  } else {
    contacts.changeSubmitButtonState(false);
  }
});

events.on('order: incorrect-phone', () => {
  contacts.changeSubmitButtonState(false);
});

// events.on('order: send-post', () => {

// })

events.onAll((event) => {
  console.log(event.eventName, event.data);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal: open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal: close', () => {
  page.locked = false;
});
