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

    // Hide the Previous button if at Step 1
    if (this.state.currentIndex > 0) {
      buttons.push({
        title: "Previous",
        action: {
          type: "Submit",
          parameters: {
            id: "previous",
            op: -1, // Decrement the index
          },
        },
      });
    }
    // Hide the Next button if at the end
    if (this.state.currentIndex < this.state.items.length - 1) {
      buttons.push({
        title: "Next",
        action: {
          type: "Submit",
          parameters: {
            id: "next",
            op: 1, // Increment the index
          },
        },
      });
    }

    return buttons as [ICardButton] | [ICardButton, ICardButton];
  }

  public get data(): IBasicCardParameters {
    const {Divisa, precio,simbolo} = this.state.items[this.state.currentIndex]
    return {
      primaryText: `${Divisa} : ${precio} ${simbolo}`
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    console.log(this.state.items);
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
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
