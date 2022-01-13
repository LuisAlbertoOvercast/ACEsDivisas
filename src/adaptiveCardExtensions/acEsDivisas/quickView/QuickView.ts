import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AcEsDivisasAdaptiveCardExtensionStrings';
import { IAcEsDivisasAdaptiveCardExtensionProps, IAcEsDivisasAdaptiveCardExtensionState } from '../AcEsDivisasAdaptiveCardExtension';

export interface IQuickViewData {
  companyName: string;
  primaryExchange: string;
  symbol: string;
  latestPrice: string;
  latestUpdate: string;
  open: string;
  High: string,
  Low: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IAcEsDivisasAdaptiveCardExtensionProps,
  IAcEsDivisasAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const { Divisa, idSerie, precio, simbolo, } = this.state.items[0];
    return {
      companyName: "strings.SubTitle",
      primaryExchange: "texto",
      symbol: "texto",
      latestPrice: Divisa,
      latestUpdate: idSerie,
      open: precio,
      High: simbolo,
      Low: simbolo
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DivisasTemplate.json');
  }
}