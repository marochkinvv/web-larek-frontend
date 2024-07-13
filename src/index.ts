import './scss/styles.scss';
import { CatalogModel } from './components/CatalogModel';
import { CatalogApi } from './components/CatalogApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';

const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const api = new CatalogApi(API_URL);
const page = new Page(ensureElement('.page'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardPreview = new CardPreview(cloneTemplate('#card-preview'), events);

api
	.getData()
	.then((data) => {
		catalogModel.setCards(data.items);
	})
	.catch((err) => console.log(err));

events.on('cards: changed', () => {
	// console.log(catalogModel.getCatalog());
	const cardsHTMLArray = catalogModel.getCatalog().map((item) => {
		item.image = `${CDN_URL}${item.image}`;
		const newCard = new Card('card', cloneTemplate('#card-catalog'), events);
		return newCard.render(item);
	});

	page.render({
		counter: catalogModel.getInCartTotal(),
		catalog: cardsHTMLArray,
		locked: false,
	});
});

events.on('card:select', (data: { id: string }) => {
	const currentCard = Object.values(data).toString();

	modal.render({
		content: cardPreview.render(catalogModel.getCard(currentCard)),
	});
});

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});