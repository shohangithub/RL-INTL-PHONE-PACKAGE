export interface ICountryModel {
  isoCode: string;
  name: string;
  flagCssClass: string;
  inputMasking: string;
  countryPhoneCode: string;
  isShowCustomFlag: boolean;
  customFlagUrl?: string;
}

/**
 * Class for set the country
 */
export class CustomCountryModel {
  isoCode: string;
  name?: string;
  inputMasking?: string;
  countryPhoneCode?: string;
  customFlagUrl?: string;
  constructor() {}
}

/**
 * Class for return the final result when input is filled correctly.
 */
export class NumberResult {
  number: string;
  rawNumber: string;
  countryModel: ICountryModel;
}
