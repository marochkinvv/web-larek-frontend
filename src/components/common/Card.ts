import { ECardCategory, ICard, TCardCategory } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Card extends Component<ICard> {
  protected cardId: string;
  protected cardImage: HTMLImageElement;
  protected cardTitle: HTMLElement;
  protected cardCategory: HTMLElement;
  protected cardPrice: HTMLElement;
  protected isInCart: boolean;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);
  }

  set id(value: string) {
    this.cardId = value;
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set price(value: number) {
    if (value !== null) {
      this.setText(
        this.cardPrice,
        `${new Intl.NumberFormat('ru-RU').format(value)} синапсов`
      );
    } else {
      this.setText(this.cardPrice, `Бесценно`);
    }
  }

  set status(value: boolean) {
    this.isInCart = value;
  }
}

// Класс для карточки в каталоге
export class CardCatalogPreview extends Card {
  constructor(
    blockName: string,
    container: HTMLElement,
    events: IEvents
  ) {
    super('card', container, events);
    this.cardTitle = ensureElement(
      `.${blockName}__title`,
      this.container
    );
    this.cardPrice = ensureElement(
      `.${blockName}__price`,
      this.container
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      `.${blockName}__image`,
      this.container
    );
    this.cardCategory = ensureElement(
      `.${blockName}__category`,
      this.container
    );

    this.container.addEventListener('click', () => {
      this.events.emit('card: select', { data: this.cardId });
    });
  }

  set image(src: string) {
    this.setImage(this.cardImage, src);
  }

  set category(value: TCardCategory) {
    this.setText(this.cardCategory, value);

    const currentKey = (
      Object.keys(ECardCategory) as TCardCategory[]
    ).find((key) => {
      return ECardCategory[key] === (value as string);
    });

    if (this.cardCategory.textContent === value) {
      this.toggleClass(
        this.cardCategory,
        `card__category_${currentKey}`,
        true
      );
    }
  }
}

// Класс для карточки в модалке
export class CardModalPreview extends Card {
  protected cardDescription: HTMLElement;
  protected cardButton: HTMLButtonElement;
  protected isInCart: boolean;

  constructor(
    blockName: string,
    container: HTMLElement,
    events: IEvents
  ) {
    super('card', container, events);

    this.cardDescription = ensureElement(
      `.${blockName}__text`,
      this.container
    );

    this.cardPrice = ensureElement(
      `.${blockName}__price`,
      this.container
    );

    this.cardImage = ensureElement<HTMLImageElement>(
      `.${blockName}__image`,
      this.container
    );

    this.cardTitle = ensureElement(
      `.${blockName}__title`,
      this.container
    );

    this.cardCategory = ensureElement(
      `.${blockName}__category`,
      this.container
    );

    this.cardButton = ensureElement<HTMLButtonElement>(
      `.${blockName}__button`,
      this.container
    );

    this.cardButton.addEventListener('click', () => {
      this.isInCart = !this.isInCart;
      this.setButtonText();
      this.events.emit('card: change-card-state', {
        data: this.cardId,
      });
    });
  }

  set image(src: string) {
    this.setImage(this.cardImage, src);
  }

  set description(value: string) {
    if (this.cardDescription) {
      this.setText(this.cardDescription, value);
    }
  }

  set price(value: number) {
    if (value !== null) {
      this.setText(
        this.cardPrice,
        `${new Intl.NumberFormat('ru-RU').format(value)} синапсов`
      );
    } else {
      this.setText(this.cardPrice, 'Бесценно');
    }
  }

  set category(value: TCardCategory) {
    this.setText(this.cardCategory, value);

    const currentKey = (
      Object.keys(ECardCategory) as TCardCategory[]
    ).find((key) => {
      return ECardCategory[key] === (value as string);
    });

    if (this.cardCategory.textContent === value) {
      this.toggleClass(
        this.cardCategory,
        `card__category_${currentKey}`,
        true
      );
    }
  }

  setButtonText() {
    if (this.isInCart) {
      return (this.cardButton.textContent = 'Убрать');
    } else {
      return (this.cardButton.textContent = 'В корзину');
    }
  }

  setButtonActiveState() {
    if (this.cardPrice.textContent === 'Бесценно') {
      this.setDisabled(this.cardButton, true);
    }
  }
}

// Класс для карточки в корзине
export class CardInCartPreview extends Card {
  protected cardIndex: HTMLElement;
  protected cardButton: HTMLButtonElement;
  protected cardId: string;

  constructor(
    blockName: string,
    container: HTMLElement,
    events: IEvents
  ) {
    super('card', container, events);

    this.cardIndex = ensureElement(
      `.${blockName}__index`,
      this.container
    );

    this.cardTitle = ensureElement(
      `.${blockName}__title`,
      this.container
    );

    this.cardPrice = ensureElement(
      `.${blockName}__price`,
      this.container
    );

    this.cardButton = ensureElement<HTMLButtonElement>(
      `.${blockName}__button`,
      this.container
    );

    this.cardButton.addEventListener('click', () => {
      this.isInCart = !this.isInCart;
      this.events.emit('card: change-card-state', {
        data: this.cardId,
      });
      this.events.emit('cart: open');
    });
  }

  set index(value: number) {
    this.setText(this.cardIndex, value.toString());
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set price(value: number) {
    if (value !== null) {
      this.setText(
        this.cardPrice,
        `${new Intl.NumberFormat('ru-RU').format(value)} синапсов`
      );
    } else {
      this.setText(this.cardPrice, `Бесценно`);
    }
  }
}
