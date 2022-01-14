import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { AcEsDivisasPropertyPane } from './AcEsDivisasPropertyPane';
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

export interface IAcEsDivisasAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IAcEsDivisasAdaptiveCardExtensionState {
  description: string;
  items: TipoCambio[];
  currentIndex: number;
}
export interface TipoCambio {
  Divisa: string,
  idSerie: string,
  precio: string,
  porcentaje: number
}

const CARD_VIEW_REGISTRY_ID: string = 'AcEsDivisas_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AcEsDivisas_QUICK_VIEW';

export default class AcEsDivisasAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAcEsDivisasAdaptiveCardExtensionProps,
  IAcEsDivisasAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AcEsDivisasPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {
      description: this.properties.description,
      currentIndex: 0,
      items: [{
        Divisa: "",
        idSerie: "",
        precio: "",
        porcentaje: 0
      },],
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return this.ConsumoApi();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'AcEsDivisas-property-pane'*/
      './AcEsDivisasPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AcEsDivisasPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  private async ConsumoApi(): Promise<void> {

    let DatosEnvio = [
      {
        Divisa: "USD/MXN - Dólar estadounidense Peso mexicano",
        idSerie: "SF63528",
        precio: "",
        porcentaje: 0
      },
      {
        Divisa: "EUR/MXN - Euro Peso mexicano",
        idSerie: "SF46410",
        precio: "",
        porcentaje: 0

      },
      {
        Divisa: "JPY/MXN - Yen japonés Peso mexicano",
        idSerie: "SF46406",
        precio: "",
        porcentaje: 0

      }]
    const DatosUrl = {
      token: "a35f563a5479767053320fc4323468d884e4215f4450f845da7f0e5c3f9f836d",
      series: "SF63528,SF46410,SF46406"
    }
    const Url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${DatosUrl.series}/datos/oportuno?token=${DatosUrl.token}`;
    const Configuracion = HttpClient.configurations.v1;
    const respuesta = await this.context.httpClient.get(Url, Configuracion)
    const resultado = await respuesta.json();


    resultado.bmx.series.forEach(elementos => {
      DatosEnvio.forEach(element => {
        if (element.idSerie === elementos.idSerie) {
          return element.precio = elementos.datos[0].dato
        }
      });
    });

    const Url1 = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${DatosUrl.series}/datos/oportuno?token=${DatosUrl.token}&incremento=PorcObsAnt`;
    const respuesta1 = await this.context.httpClient.get(Url1, Configuracion)
    const resultado1 = await respuesta1.json();


    resultado1.bmx.series.forEach(elementos => {

      DatosEnvio.forEach(element => {
        if (element.idSerie === elementos.idSerie) {
          return element.porcentaje = parseFloat(elementos.datos[0].dato)
        }
      });
    });


    console.log(DatosEnvio);
    this.setState({ items: DatosEnvio })
    return;
  }
}
