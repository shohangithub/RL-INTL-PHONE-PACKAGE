import { Injectable } from '@angular/core';
import {
  ContentOptionsEnum,
  OutputOptionsEnum,
  SortOrderEnum,
  TooltipOptionsEnum,
} from './Enums';

/**
 * Class for configure the dropdown.
 */
@Injectable()
export class ConfigurationOptions {
  /**
   * Prperty to set the selector for the dropdown.
   * Default : 'IntlPhoneNumber'
   */
  public selectorClass: string = 'IntlPhoneNumber';

  /**
   * Property to set which content show in option
   * Default : Flag, CountryPhoneCode
   */
  public optionTextTypes: ContentOptionsEnum[] = [
    ContentOptionsEnum.Flag,
    ContentOptionsEnum.CountryPhoneCode,
  ];

  /**
   * Property to set the tooltip text
   * Default : Country Name
   */
  public toolTipText: TooltipOptionsEnum = TooltipOptionsEnum.CountryName;

  /**
   * Property to set whether tooltip is show or not.
   * Default : true
   */
  public isShowToolTip: boolean = true;

  /**
   * Property to set whether user want search option or not.
   * Default : true
   */
  public isShowSearchOption: boolean = true;

  /**
   * Property to set the sort order of country list to be rendered.
   * Default : CountryISOCode
   */
  public sortBy: SortOrderEnum = SortOrderEnum.CountryISOCode;

  /**
   * Property to set whether show all other country in dropdown as well or not, when specify custom country list in module.
   * Default : true
   */
  public isShowAllOtherCountry: boolean = true;

  /**
   * Property to set in which format user want the output when fill the input correctly.
   * Default : NumberWithCountryCode
   */
  public outputFormat: OutputOptionsEnum =
    OutputOptionsEnum.NumberWithCountryCode;
}
