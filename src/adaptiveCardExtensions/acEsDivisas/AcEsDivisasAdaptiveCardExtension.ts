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
  CriptomonedaActivado: boolean;
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
  porcentaje: number,
  abreviatura: string
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
        porcentaje: 0,
        abreviatura: ""
      },],
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    if (this.properties.CriptomonedaActivado) {
      return this.ConsumoApiCriptomoneda()
    } else {
      return this.ConsumoApiDivisa()
    }
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/exchange.svg');
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

  private async ConsumoApiDivisa(): Promise<void> {

    let DatosEnvio = [
      {
        Divisa: "USD/MXN - Dólar estadounidense Peso mexicano",
        idSerie: "SF63528",
        precio: "",
        porcentaje: 0,
        abreviatura: "USD"
      },
      {
        Divisa: "EUR/MXN - Euro Peso mexicano",
        idSerie: "SF46410",
        precio: "",
        porcentaje: 0,
        abreviatura: "EUR"
      },
      {
        Divisa: "JPY/MXN - Yen japonés Peso mexicano",
        idSerie: "SF46406",
        precio: "",
        porcentaje: 0,
        abreviatura: "JPY"
      }]
    const DatosUrl = {
      token: "c17ce7b2809a56055e1413f0735251cc8e1b06e6a8e1c01ec074f2c156df64ab",
      series: "SF63528,SF46410,SF46406"
    }
    const Url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${DatosUrl.series}/datos/oportuno?token=${DatosUrl.token}`;
    const Configuracion = HttpClient.configurations.v1;
    const respuesta = await this.context.httpClient.get(Url, Configuracion)
    const resultado = await respuesta.json();


    resultado.bmx.series.forEach(elementos => {
      DatosEnvio.forEach(element => {
        if (element.idSerie === elementos.idSerie) {
          const PrecioAsignar = elementos.datos[0].dato;
          let limitarDecimales = parseFloat(PrecioAsignar).toFixed(2);
          return element.precio = limitarDecimales;
          //   return element.precio = elementos.datos[0].dato
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
    this.setState({ items: DatosEnvio })
    return;
  }

  private async ConsumoApiCriptomoneda(): Promise<void> {

    let DatosEnvio = [
      {
        Divisa: "Bitcoin",
        idSerie: "BTC",
        precio: "",
        porcentaje: 0,
        abreviatura: "BTC"
      },
      {
        Divisa: "Cardano",
        idSerie: "ADA",
        precio: "",
        porcentaje: 0,
        abreviatura: "ADA"
      },
      {
        Divisa: "Ethereum",
        idSerie: "ETH",
        precio: "",
        porcentaje: 23,
        abreviatura: "ETH"

      }]
    const DatosUrl = {
      series: "BTC,ETH,ada"
    }
    const Url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${DatosUrl.series}&tsyms=MXN`;
    const Configuracion = HttpClient.configurations.v1;
    const respuesta = await this.context.httpClient.get(Url, Configuracion)
    const resultado = await respuesta.json();


    DatosEnvio.forEach(element => {
      const precio = resultado.DISPLAY[element.idSerie]["MXN"].PRICE;
      let cambio2 = precio.replace('MXN ', '')
      return element.precio = cambio2

    });

    DatosEnvio.forEach(element => {
      const precio_cierre = resultado.DISPLAY[element.idSerie]["MXN"].OPEN24HOUR;
      let cambio = precio_cierre.replace('MXN ', '')
      cambio = cambio.replace(',', '')
      const precio = resultado.DISPLAY[element.idSerie]["MXN"].PRICE;
      let cambio2 = precio.replace('MXN ', '')
      cambio2 = cambio2.replace(',', '')
      let diferencia_porcentaje = ((parseFloat(cambio2) - parseFloat(cambio)) * 100) / cambio2
      let cambioPorcentaje = diferencia_porcentaje.toFixed(2);
      return element.porcentaje = parseFloat(cambioPorcentaje);

    });

    this.setState({ items: DatosEnvio })
    return;
  }



  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {


    if (propertyPath === "CriptomonedaActivado") {
      this.properties.CriptomonedaActivado ? this.ConsumoApiCriptomoneda() : this.ConsumoApiDivisa()
    }
  }
}
