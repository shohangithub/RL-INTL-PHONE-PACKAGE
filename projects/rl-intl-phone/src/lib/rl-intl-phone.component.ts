import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ConfigurationOptions } from './model/Configuration';
import {
  ICountryModel,
  CustomCountryModel,
  NumberResult,
} from './model/CountryModel';
import { RLIntlPhoneService } from './rl-intl-phone.service';
import {
  ContentOptionsEnum,
  OutputOptionsEnum,
  SortOrderEnum,
  TooltipOptionsEnum,
} from './model/Enums';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var $: any;

@Component({
  selector: 'rl-intl-phone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rl-intl-phone.component.html',
  styleUrls: [`./rl-intl-phone.component.css`],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RlIntlPhoneComponent),
      multi: true,
    },
  ],
})
export class RlIntlPhoneComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  /**
   * Input property to set the Custom Country List.
   */
  @Input() countryList: CustomCountryModel[];

  /**
   * Input property to provide the configuration of module and its feature.
   */
  @Input() configurationOption: ConfigurationOptions;

  /**
   * Input property to set the prefilled number value.
   */
  @Input() numberTextValue: string;
  @Input() placeholder: string = '';

  /**
   * Input property to set the unique key for component unique selector.
   */
  @Input() key: string = 'phone_number';

  /**
   * Input property to set the selected country isocode not able to get correctly from number text value.
   */
  @Input() selectedCountryISOCode: string;

  /**
   * Output event : It is fire when Is Required flag is change.
   */
  @Output() onIsRequiredChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  /**
   * Output event : It is fire when Number is filled completly according to input masking.
   * return number or number with country code.
   */
  @Output() onNumberChange: EventEmitter<NumberResult> =
    new EventEmitter<NumberResult>();

  /**
   * Output event : It is fire when Number is filled completly according to input masking.
   * return number or number with country code.
   */
  @Output() onCountryDrpdwnChange: EventEmitter<ICountryModel> =
    new EventEmitter<ICountryModel>();
  onChange: any = () => {};
  onTouched: any = () => {};

  /**
   *
   * @param obj In this InputCountryModel : In "Number" we expect mobile number without country code and "isoCode" we expect ISO code
   * for setting the country flag.
   */
  writeValue(obj: NumberResult): void {
    if (obj && obj.countryModel.isoCode) {
      let selectedCountry = this.filteredCountryList.find(
        (x) => x.isoCode == obj.countryModel.isoCode
      );
      if (selectedCountry && selectedCountry.isoCode) {
        $('.' + this.configurationOption.selectorClass + this.key + ' .CountryDrpDwn')
          .val(selectedCountry.isoCode)
          .trigger('change');
        $(
          '.' + this.configurationOption.selectorClass + this.key + ' .CountryNumberInput'
        ).val(obj.rawNumber);
      }
    }
  }

  /**
   * Register On Change Event
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  /**
   * Register on touched events.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get value() {
    return this.outputResult;
  }

  set value(obj: NumberResult) {
    this.writeValue(obj);
  }
  /**
   * Method to set the enable/disable state of the control using reactive form.
   */
  setDisabledState?(isDisabled: boolean): void {
    if ($('.' + this.configurationOption.selectorClass + this.key + ' .CountryDrpDwn')) {
      $('.' + this.configurationOption.selectorClass + this.key + ' .CountryDrpDwn').prop(
        'disabled',
        isDisabled
      );
    }
    if (
      $('.' + this.configurationOption.selectorClass + this.key + ' .CountryNumberInput')
    ) {
      $(
        '.' + this.configurationOption.selectorClass + this.key + ' .CountryNumberInput'
      ).prop('disabled', isDisabled);
    }
  }
  IsInputComplete: boolean = false;

  allCountryList: ICountryModel[] = [];
  filteredCountryList: ICountryModel[] = [];
  selectedCountry: ICountryModel;
  outputResult: NumberResult;
  constructor(private _service: RLIntlPhoneService) {
    /**
     * Get Country list data.
     */
    this.allCountryList = this._service.GetCountryList();
    //assign the configuration option if found null so default dropdown will run.
    if (
      this.configurationOption == null ||
      this.configurationOption == undefined
    ) {
      this.configurationOption = new ConfigurationOptions();
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeCountryDrpDwn();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['numberTextValue'] &&
      changes['numberTextValue'].previousValue !=
        changes['numberTextValue'].currentValue
    ) {
      this.initializeCountryDrpDwn();
    }
  }

  /**
   * Method to initialize the country Dropdown.
   */
  initializeCountryDrpDwn() {

    //#region Apply filter based on user given country list
    if (
      this.countryList != null &&
      this.countryList != undefined &&
      this.countryList.length > 0
    ) {
      //check whether specify in configuration to show all other country or not.
      if (this.configurationOption.isShowAllOtherCountry) {
        this.filteredCountryList = [];
        this.filteredCountryList = this.filteredCountryList.concat(
          this.allCountryList
        );
      }

      //Loop through the user country list and add/change the value in filteredCountryList.
      this.countryList.forEach((customCountry) => {

        let existingCountry = this.filteredCountryList.find(
          (x) => x.isoCode.toLowerCase() == customCountry.isoCode.toLowerCase()
        );
        if (existingCountry != null && existingCountry != undefined) {
          //update country in list.
          //remove the existing item.
          var existingIndex = this.filteredCountryList.findIndex(
            (x) => x.isoCode == existingCountry?.isoCode
          );
          if (existingIndex > -1) {
            this.filteredCountryList.splice(existingIndex, 1);
          }
          existingCountry =
            this.getCountryOptionFromCustomCountry(customCountry);

          //add element in array.
          this.filteredCountryList.push(existingCountry);
        } else {
          //add country in list.
          this.filteredCountryList.push(
            this.getCountryOptionFromCustomCountry(customCountry)
          );
        }
      });
    } else {
      this.filteredCountryList = this.allCountryList;
    }
    //#endregion


    //#region Apply Sorting based on configuration.
    switch (this.configurationOption.sortBy) {
      case SortOrderEnum.CountryName:
        this.filteredCountryList = this.filteredCountryList.sort(
          (objA, objB) => {
            if (objA.name < objB.name) return -1;
            else if (objA.name > objB.name) return 1;
            return 0;
          }
        );
        break;
      case SortOrderEnum.CountryISOCode:
        this.filteredCountryList = this.filteredCountryList.sort(
          (objA, objB) => {
            if (objA.isoCode < objB.isoCode) return -1;
            else if (objA.isoCode > objB.isoCode) return 1;
            return 0;
          }
        );
        break;
      case SortOrderEnum.CountryPhoneCode:
        this.filteredCountryList = this.filteredCountryList.sort(
          (objA, objB) => {
            if (objA.countryPhoneCode < objB.countryPhoneCode) return -1;
            else if (objA.countryPhoneCode > objB.countryPhoneCode) return 1;
            return 0;
          }
        );
        break;
    }
    //#endregion


    //#region  set the selected country dropdown and set the input value.
    let selectedCountry: any;
    let NumberValue: any;
    if (
      this.numberTextValue != null &&
      this.numberTextValue != undefined &&
      this.numberTextValue != ''
    ) {
      //get the country code from number and set the selected country.
      let countryCode = this.numberTextValue.split(/ /)[0];
      //replace the country code from numbertext.
      NumberValue = this.numberTextValue.replace(countryCode, '');
      NumberValue = NumberValue.trim();



      if (countryCode.includes('+')) {
        //check if country contain bracket then get country code till next space.
        if (NumberValue[0] == '(') {
          countryCode += ' ' + NumberValue.split(/ /)[0];
          NumberValue = this.numberTextValue.replace(countryCode, '');
        }
        //add the space in country code and trim the numbervalue.
        countryCode += ' ';
        NumberValue = NumberValue.trim();
      } else {
        NumberValue = countryCode;
        countryCode = '';
      }



      //set the countrycode from
      this.filteredCountryList = $.map(
        this.filteredCountryList,
        (objCountry: { selected: boolean }) => {
          objCountry.selected = false;
          return objCountry;
        }
      );




      if (
        this.selectedCountryISOCode != null &&
        this.selectedCountryISOCode != undefined &&
        this.selectedCountryISOCode != ''
      ) {
        //get the selected country dropdown match the inital 3 character with the countrycode from the filteredcountry list.
        selectedCountry = this.filteredCountryList.find(
          (x) => x.isoCode == this.selectedCountryISOCode
        );
        if (selectedCountry != null && selectedCountry != undefined) {
          selectedCountry.selected = true;
        }
      } else {
        //get the selected country dropdown match the inital 3 character with the countrycode from the filteredcountry list.
        selectedCountry = this.filteredCountryList.find(
          (x) => x.countryPhoneCode == countryCode
        );
        if (selectedCountry != null && selectedCountry != undefined) {
          selectedCountry.selected = true;
        }
      }
    }

    //SET DEFAULT SELECTED COUNTRY CODE
    if (
      (this.numberTextValue == null || this.numberTextValue == undefined || this.numberTextValue == '') &&
      this.selectedCountryISOCode != null &&
      this.selectedCountryISOCode != undefined &&
      this.selectedCountryISOCode != ''
    ) {
      //get the selected country dropdown match the inital 3 character with the countrycode from the filteredcountry list.
      selectedCountry = this.filteredCountryList.find(
        (x) => x.isoCode == this.selectedCountryISOCode
      );
      if (selectedCountry != null && selectedCountry != undefined) {
        selectedCountry.selected = true;
      }
    }

    //#endregion

    //#region set the id and title for the country dropdown.
    var selectedDrpDwnData = $.map(
      this.filteredCountryList,
      (obj: {
        id: any;
        isoCode: any;
        title: string;
        name: any;
        countryPhoneCode: any;
      }) => {
        obj.id = obj.isoCode;
        //set the tooltip, if flag is true and based of value which is set in the configuration.
        if (this.configurationOption.isShowToolTip) {
          switch (this.configurationOption.toolTipText) {
            case TooltipOptionsEnum.CountryName:
              obj.title = obj.name;
              break;
            case TooltipOptionsEnum.CountryISOCode:
              obj.title = obj.isoCode;
              break;
            case TooltipOptionsEnum.CountryPhoneCode:
              obj.title = obj.countryPhoneCode;
              break;
            default:
              obj.title = '';
              break;
          }
        } else {
          obj.title = '';
        }
        return obj;
      }
    );
    //#endregion

    $('.' + this.configurationOption.selectorClass + this.key + ' .CountryDrpDwn').select2(
      {
        data: selectedDrpDwnData,
        templateResult: this.prepareHtmlOptionToRender,
        minimumResultsForSearch: this.configurationOption.isShowSearchOption
          ? 0
          : Infinity,
        matcher: this.searchCountryData,
        templateSelection: this.prepareHtmlOptionSelected,
      }
    );
    if (selectedCountry && selectedCountry.selected) {
      $('.' + this.configurationOption.selectorClass + this.key + ' .CountryDrpDwn')
        .val(selectedCountry.id)
        .trigger('change');
    }

    if (NumberValue != null && NumberValue != undefined && NumberValue != '') {
      $(
        '.' + this.configurationOption.selectorClass + this.key + ' .CountryNumberInput'
      ).val(NumberValue);
    }
  }

  /**
   * Method to prepare the html and render the option html based on configuration.
   * Set the option html based on configuration provided
   */
  prepareHtmlOptionToRender = (country: ICountryModel) => {
    let optionHtml = '';
    optionHtml += `<div class="CountryOptionItem">`;
    if (
      this.configurationOption.optionTextTypes.includes(ContentOptionsEnum.Flag)
    ) {
      //check if customflag url is set then show the for that url
      if (
        country.isShowCustomFlag != null &&
        country.isShowCustomFlag != undefined &&
        country.isShowCustomFlag
      ) {
        optionHtml +=
          `<div class="flags" style="background:url(` +
          country.customFlagUrl +
          `) no-repeat center/contain;"></div>`;
      } else {
        optionHtml += `<div class="flags ` + country.flagCssClass + `"></div>`;
      }
    }
    if (
      this.configurationOption.optionTextTypes.includes(
        ContentOptionsEnum.CountryName
      )
    ) {
      optionHtml += `<div class="CountryText">` + country.name + `</div>`;
    }
    if (
      this.configurationOption.optionTextTypes.includes(
        ContentOptionsEnum.CountryPhoneCode
      )
    ) {
      optionHtml +=
        `<div class="CountryCode"> ` + country.countryPhoneCode + `</div>`;
    }
    optionHtml += `</div>`;
    return $(optionHtml);
  };

  /**
   * Return the Country falg and country code.
   * Change the input masking for the input.
   */
  prepareHtmlOptionSelected = (selectedItem: any) => {
    this.selectedCountry = selectedItem;
    let selectedHtml = '';
    selectedHtml += `<div class="CountryOptionItem CountryOptionSelected">`;
    //check if customflag url is set then show the for that url
    if (
      selectedItem.isShowCustomFlag != null &&
      selectedItem.isShowCustomFlag != undefined &&
      selectedItem.isShowCustomFlag
    ) {
      selectedHtml +=
        `<div class="flags" style="background:url(` +
        selectedItem.customFlagUrl +
        `) no-repeat center/contain;"></div>`;
    } else {
      selectedHtml +=
        `<div class="flags ` + selectedItem.flagCssClass + `"></div>`;
    }

    selectedHtml +=
      `<div class="CountryCode"> ` + selectedItem.countryPhoneCode + `</div>`;
    selectedHtml += `</div>`;

    if (
      this.selectedCountry != null &&
      this.selectedCountry.inputMasking != null &&
      this.selectedCountry.inputMasking != ''
    ) {
      $(
        '.' + this.configurationOption.selectorClass + this.key + ' .CountryNumberInput'
      ).inputmask(this.selectedCountry.inputMasking, {
        placeholder: '_',
        oncomplete: this.maskingOnCompleteEvent,
        onincomplete: this.maskingOnInCompleteEvent,
        oncleared: this.maskingOnClearedEvent,
      });
      //emit the output event.
      this.onCountryDrpdwnChange.emit(this.selectedCountry);
    }
    return $(selectedHtml);
  };

  /**
   * Method for apply the searching for the select 2.
   * Searching is apply based on country name, country ISO Code and Country phone Code.
   */
  searchCountryData = (
    params: { term: string | null | undefined } | null | undefined,
    data: ICountryModel
  ) => {
    //check if query is empty then return show all listing.
    if (
      params != null &&
      params != undefined &&
      params.term != null &&
      params.term != undefined &&
      params.term != ''
    ) {
      //if query match with in name or phonecode or iso then return the data otherwise return null.
      try {
        if (
          data.name.toLowerCase().includes(params.term.toLowerCase()) ||
          data.countryPhoneCode
            .toLowerCase()
            .includes(params.term.toLowerCase()) ||
          data.isoCode.toLowerCase().includes(params.term.toLowerCase())
        ) {
          return data;
        }
        return null;
      } catch {
        return null;
      }
    } else {
      return data;
    }
  };

  /**
   * Method return the country option from the customcountry option.
   * Check if user given country is not available our list then add in the country.
   * Check if user given country is available in our list then replace those value which is not given by user.
   */
  getCountryOptionFromCustomCountry = (
    customCountry: CustomCountryModel
  ): ICountryModel => {
    let existingCountry = this.allCountryList.find(
      (x) => x.isoCode == customCountry.isoCode
    );
    if (existingCountry != null && existingCountry != undefined) {
      //change the name.
      if (
        customCountry.name != null &&
        customCountry.name != undefined &&
        customCountry.name != ''
      ) {
        existingCountry.name = customCountry.name;
      }
      //change in input masking.
      if (
        customCountry.inputMasking != null &&
        customCountry.inputMasking != undefined &&
        customCountry.inputMasking != ''
      ) {
        existingCountry.inputMasking = customCountry.inputMasking;
      }

      //set the country phonecode
      if (
        customCountry.countryPhoneCode != null &&
        customCountry.countryPhoneCode != undefined &&
        customCountry.countryPhoneCode != ''
      ) {
        existingCountry.countryPhoneCode = customCountry.countryPhoneCode;
      }

      //set the custom flag url
      if (
        customCountry.customFlagUrl != null &&
        customCountry.customFlagUrl != undefined &&
        customCountry.customFlagUrl != ''
      ) {
        existingCountry.customFlagUrl = customCountry.customFlagUrl;
        existingCountry.isShowCustomFlag = true;
      }
      return existingCountry;
    } else {
      let OutputCountry: ICountryModel = {
        name: customCountry.name ?? '',
        isoCode: customCountry.isoCode,
        flagCssClass: 'flags ',
        countryPhoneCode: customCountry.countryPhoneCode ?? '',
        inputMasking: customCountry.inputMasking ?? '',
        customFlagUrl: customCountry.customFlagUrl,
        isShowCustomFlag: true,
      };
      return OutputCountry;
    }
  };

  /**
   * Event to handle the completed event for input masking.
   */
  maskingOnCompleteEvent = (e: any): void => {
    this.IsInputComplete = true;
    this.emitIsRequiredEvent();
  };

  /**
   * Event to handle incomplete event for input masking.
   */
  maskingOnInCompleteEvent = (e: any): void => {
    this.IsInputComplete = false;
    this.emitIsRequiredEvent();
  };

  /**
   * Event to handle cleared event for input masking.
   */
  maskingOnClearedEvent = (e: any): void => {
    this.IsInputComplete = false;
    this.emitIsRequiredEvent();
  };

  /**
   * Emit is Input completed event to outer component.
   */
  emitIsRequiredEvent() {
    this.onIsRequiredChange.emit(this.IsInputComplete);
    if (this.IsInputComplete) {
      this.emitOnNumberChange();
    } else {
      this.outputResult = null as any;
      //updating null value in the form group.
      this.onChange(null);
    }
  }

  /**
   * Emit when input is change and completed the masking.
   * Return the output value based on configuration that whether we need to return number only or number with country code.
   */
  emitOnNumberChange() {
    let inputValue: string = $(
      '.' + this.configurationOption.selectorClass + this.key + ' .CountryNumberInput'
    ).val();

    this.outputResult = {
      countryModel: this.selectedCountry,
      number: '',
      rawNumber: '',
    };
    if (
      this.configurationOption.outputFormat ==
      OutputOptionsEnum.NumberWithCountryCode
    ) {
      let selectedCountryCode: string = this.selectedCountry.countryPhoneCode;
      this.outputResult.number = selectedCountryCode + inputValue;
      this.outputResult.rawNumber = inputValue?.replace(/[^\w]/gi, '') ?? '';
    } else {
      this.outputResult.number = inputValue;
      this.outputResult.rawNumber = inputValue?.replace(/[^\w]/gi, '') ?? '';
    }
    this.onNumberChange.emit(this.outputResult);
    this.onChange(this.outputResult);
  }
}
