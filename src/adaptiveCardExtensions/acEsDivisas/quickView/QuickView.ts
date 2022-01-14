import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AcEsDivisasAdaptiveCardExtensionStrings';
import { IAcEsDivisasAdaptiveCardExtensionProps, IAcEsDivisasAdaptiveCardExtensionState } from '../AcEsDivisasAdaptiveCardExtension';

export interface IQuickViewData {
  companyName: string;
  latestPrice: string;
  Low: string;
  changePercent: number;
}

export class QuickView extends BaseAdaptiveCardView<
  IAcEsDivisasAdaptiveCardExtensionProps,
  IAcEsDivisasAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {    
    const { Divisa, idSerie, precio, porcentaje } = this.state.items[this.state.currentIndex];

    return {
      companyName: Divisa,
      latestPrice: precio,
      Low: precio,
      changePercent: porcentaje
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DivisasTemplate.json');
  }
}