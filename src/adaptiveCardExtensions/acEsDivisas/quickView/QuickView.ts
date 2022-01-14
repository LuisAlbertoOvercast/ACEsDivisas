import { ISPFxAdaptiveCard, BaseAdaptiveCardView,IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AcEsDivisasAdaptiveCardExtensionStrings';
import { IAcEsDivisasAdaptiveCardExtensionProps, IAcEsDivisasAdaptiveCardExtensionState } from '../AcEsDivisasAdaptiveCardExtension';

export interface IQuickViewData {
  companyName: string;
  latestPrice: string;
  Low: string;
  changePercent: number;
  title: string;
}

export class QuickView extends BaseAdaptiveCardView<
  IAcEsDivisasAdaptiveCardExtensionProps,
  IAcEsDivisasAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {    
    const { Divisa, precio, porcentaje } = this.state.items[this.state.currentIndex];
    const TextoMostrar = this.properties.CriptomonedaActivado ? "Criptomonedas" : "Divisas"
    return {
      companyName: Divisa,
      latestPrice: precio,
      Low: precio,
      changePercent: porcentaje,
      title: TextoMostrar
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/DivisasTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.type === "Submit") {
      const { id, op } = action.data;
      if (id ==="previous" ) {
        if (this.state.currentIndex > 0) {
          this.setState({ currentIndex: this.state.currentIndex + op });
        }
      }

      if (id ==="next" ) {
        if (this.state.currentIndex < this.state.items.length - 1) {
          this.setState({ currentIndex: this.state.currentIndex + op });
        }
      }
    }
  }
}