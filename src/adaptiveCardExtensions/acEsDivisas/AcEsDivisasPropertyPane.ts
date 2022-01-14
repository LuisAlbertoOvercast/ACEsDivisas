import { IPropertyPaneConfiguration,PropertyPaneTextField, PropertyPaneButton, PropertyPaneCheckbox, PropertyPaneChoiceGroup, PropertyPaneDynamicField, PropertyPaneDynamicFieldSet, PropertyPaneLabel, PropertyPaneLink, PropertyPaneSlider, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from 'AcEsDivisasAdaptiveCardExtensionStrings';

const IPropertyPaneChoiceGroupOption = [];
export class AcEsDivisasPropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneSlider('days', {
                  label: 'Number of days to view in advance',
                  max: 7,
                  min: 1
                }),
                PropertyPaneToggle('CriptomonedaActivado', {
                  label: "Criptomoneda"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
