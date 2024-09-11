import './scss/styles.scss';
import { CatalogModel } from './components/CatalogModel';
import { OrderModel } from './components/OrderModel';
import { CatalogApi } from './components/CatalogApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Page } from './components/common/Page';
import {
  cloneTemplate,
  createElement,
  ensureElement,
} from './utils/utils';
import {
  CardInCartPreview,
  CardCatalogPreview,
  CardModalPreview,
  Card,
} from './components/common/Card';
import { Modal } from './components/common/Modal';
import { Cart } from './components/common/Cart';
import { Order, Contacts } from './components/common/Order';
import { Success } from './components/common/Success';

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
const cart = new Cart(cloneTemplate('#basket'), events);
const order = new Order(cloneTemplate('#order'), events);
const contacts = new Contacts(cloneTemplate('#contacts'), events);
const success = new Success(cloneTemplate('#success'), events);

// Получаем карточки с сервера и отрисовываем Главную страницу
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

// Событие по клику на карточку в каталоге на Главной
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
    }),
  });
  newCard.setButtonActiveState();
});

// Событие по клику на корзину на Главной
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
      index: catalogModel.getCardIndexInCart(item.id) + 1,
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

// Событие при добавлении/удалении карточки в/из корзину(ы)
events.on('card: change-card-state', (data: { id: string }) => {
  const currentCard = Object.values(data).toString();
  catalogModel.changeCardInCartParam(currentCard);

  if (catalogModel.getInCart().length > 0) {
    cart.changeButtonState(true);
  } else {
    cart.changeButtonState(false);
  }

  page.render({
    counter: catalogModel.getInCartTotal(),
  });
});

// Событие по клику на кнопку "Оформить"
events.on('order: delivery-open', () => {
  modal.render({
    content: createElement<HTMLElement>('div', {}, [order.render()]),
  });
});

// Событие по клику на кнопку "Далее"
events.on('order: contacts-open', () => {
  modal.render({
    content: createElement<HTMLElement>('div', {}, [
      contacts.render(),
    ]),
  });
});

// Событие по клику на кнопки выбора способа оплаты
events.on(
  'order: choose-payment',
  (data: { value: 'online' | 'offline' }) => {
    const paymentValue = Object.values(data).toString() as
      | 'online'
      | 'offline';
    orderModel.checkValidationPayment(paymentValue);
  }
);

// Событие при инпуте адреса, отправляет значение инпута на валидацию
events.on('order: address-input', (data: { value: string }) => {
  const inputValue = Object.values(data).toString();
  orderModel.checkValidationAddress(inputValue);
});

// Событие проверяет можно ли разблокировать кнопку "Далее"
events.on('order: correct-payment', () => {
  if (orderModel.address) {
    order.changeSubmitButtonState(true);
  } else {
    order.changeSubmitButtonState(false);
  }
});

// Событие проверяет можно ли разблокировать кнопку "Далее"
events.on('order: correct-address', () => {
  order.setAddressError(true);
  if (orderModel.payment) {
    order.changeSubmitButtonState(true);
  } else {
    order.changeSubmitButtonState(false);
  }
});

// Событие блокирует кнопку "Далее" и выводит ошибку для адреса
events.on('order: incorrect-address', () => {
  order.changeSubmitButtonState(false);
  order.setAddressError(false);
});

// Событие при инпуте емэйла, отправляет значение инпута на валидацию
events.on('order: input-email', (data: { value: string }) => {
  const inputValue = Object.values(data).toString();
  orderModel.checkValidationEmail(inputValue);
});

// Событие при инпуте телефона, отправляет значение инпута на валидацию
events.on('order: input-phone', (data: { value: string }) => {
  const inputValue = Object.values(data).toString();
  orderModel.checkValidationPhone(inputValue);
});

// Событие проверяет можно ли разблокировать кнопку "Оплатить"
events.on('order: correct-email', () => {
  contacts.setEmailError(true);
  if (orderModel.phone) {
    contacts.changeSubmitButtonState(true);
  } else {
    contacts.changeSubmitButtonState(false);
  }
});

// Событие проверяет можно ли разблокировать кнопку "Оплатить"
events.on('order: correct-phone', () => {
  contacts.setPhoneError(true);
  if (orderModel.email) {
    contacts.changeSubmitButtonState(true);
  } else {
    contacts.changeSubmitButtonState(false);
  }
});

// Событие блокирует кнопку "Оплатить" и выводит ошибку для емэйла
events.on('order: incorrect-email', () => {
  contacts.changeSubmitButtonState(false);
  contacts.setEmailError(false);
});

// Событие блокирует кнопку "Оплатить" и выводит ошибку для телефона
events.on('order: incorrect-phone', () => {
  contacts.changeSubmitButtonState(false);
  contacts.setPhoneError(false);
});

// Событие по клику на кнопку "Оплатить", отправляет POST-запрос на сервер
events.on('order: send-post', () => {
  const orderCardsArray = catalogModel.getInCart().filter((card) => {
    return card.price > 0;
  });
  api
    .post(
      '/order',
      {
        payment: orderModel.payment,
        email: orderModel.email,
        phone: orderModel.phone,
        address: orderModel.address,
        total: catalogModel.getInCartTotalPrice(),
        items: orderCardsArray.map((card) => {
          return card.id;
        }),
      },
      'POST'
    )
    .then((data) => {
      success.setTotalValue(catalogModel.getInCartTotalPrice());
      modal.render({
        content: createElement<HTMLElement>('div', {}, [
          success.render(),
        ]),
      });
      catalogModel.getInCart().forEach((card) => {
        card.isInCart = false;
      });
      orderModel.reset();
      order.resetOrder();
      contacts.resetContacts();
      cart.changeButtonState(false);
      page.render({
        counter: catalogModel.getInCartTotal(),
      });
    })
    .catch((err) => console.log(err));
});

events.on('success: close', () => {
  modal.close();
});

// Вывод всех событий в консоль
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
