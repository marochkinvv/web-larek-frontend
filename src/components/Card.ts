import { ECardCategory, ICard, TCardCategory } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/Events';

export class Card extends Component<ICard> {
	protected cardId: string;
	protected cardDescription?: HTMLElement;
	protected cardImage?: HTMLImageElement;
	protected cardTitle: HTMLElement;
	protected cardCategory?: HTMLElement;
	protected cardPrice: HTMLElement;
	protected isInCart: boolean;
	protected cardButton?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);
		this.cardTitle = ensureElement(`.${blockName}__title`, this.container);
		this.cardPrice = ensureElement(`.${blockName}__price`, this.container);
		this.cardImage = ensureElement(
			`.${blockName}__image`,
			this.container
		) as HTMLImageElement;
		this.cardCategory = ensureElement(
			`.${blockName}__category`,
			this.container
		);

		this.cardImage.addEventListener('click', () =>
			this.events.emit('card:select', { data: this.cardId })
		);
	}

	set id(value: string) {
		this.cardId = value;
	}

	set image(src: string) {
		this.setImage(this.cardImage, src);
	}

	set title(value: string) {
		this.setText(this.cardTitle, value);
	}

	set price(value: string) {
		if (value !== null) {
			this.setText(
				this.cardPrice,
				`${new Intl.NumberFormat('ru-RU').format(Number(value))} синапсов`
			);
		} else {
			this.setText(this.cardPrice, `Бесценно`);
		}
	}

	set category(value: TCardCategory) {
		this.setText(this.cardCategory, value);

		const currentKey = (Object.keys(ECardCategory) as TCardCategory[]).find(
			(key) => {
				return ECardCategory[key] === (value as string);
			}
		);

		if (this.cardCategory.textContent === value) {
			this.toggleClass(this.cardCategory, `card__category_${currentKey}`, true);
		}
	}
}

export class CardPreview extends Card {

	constructor(container: HTMLElement, events: IEvents) {
		super('card', container, events);

		this.cardDescription = ensureElement(`.card__text`, this.container);
	}

	set description(value: string) {
		if (this.cardDescription) {
			this.setText(this.cardDescription, value);
		}
	}
}
