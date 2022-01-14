import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AcEsDivisasAdaptiveCardExtensionStrings';
import { IAcEsDivisasAdaptiveCardExtensionProps, IAcEsDivisasAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AcEsDivisasAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAcEsDivisasAdaptiveCardExtensionProps, IAcEsDivisasAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const buttons: ICardButton[] = [];
    return buttons as [ICardButton] | [ICardButton, ICardButton];
  }

  public get data(): IBasicCardParameters {
    const TextoMostrar = this.properties.CriptomonedaActivado ? "Criptomonedas" : "Divisas"
    return {
      primaryText: `Tipo cambio: ${TextoMostrar}`
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    //console.log(this.state.items);
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }

  public onAction(action: IActionArguments): void {
    if (action.type === "Submit") {
      const { id, op } = action.data;
      switch (id) {
        case "previous":
        case "next":
          this.setState({ currentIndex: this.state.currentIndex + op });
          break;
      }
    }
  }
}
