import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  ConfigurationOptions,
  ContentOptionsEnum,
  CustomCountryModel,
  NumberResult,
  OutputOptionsEnum,
  RlIntlPhoneComponent,
} from 'rl-intl-phone';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    RlIntlPhoneComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'international-phone-number';
  selectedCountryList: CustomCountryModel[] = [];
  configOption1: ConfigurationOptions;
  configOption2: ConfigurationOptions;
  configOption3: ConfigurationOptions;
  sampleForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.sampleForm = this.formBuilder.group({
      sampleReactiveControl: [null],
    });

    this.selectedCountryList.push({
      isoCode: 'TE',
      name: 'TEST',
      countryPhoneCode: '+39',
      customFlagUrl: '../assets/images.jpg',
      inputMasking: '999 999 9999',
    });
    this.selectedCountryList.push({ isoCode: 'IN', name: 'INDIATEST' });
    this.configOption1 = new ConfigurationOptions();
    this.configOption2 = new ConfigurationOptions();
    this.configOption3 = new ConfigurationOptions();
    this.configOption2.selectorClass = 'CountryInput1';
    this.configOption2.optionTextTypes = [];
    this.configOption2.optionTextTypes.push(ContentOptionsEnum.Flag);
    this.configOption2.optionTextTypes.push(ContentOptionsEnum.CountryName);

    this.configOption1.selectorClass = 'CountryInput2';
    this.configOption1.isShowAllOtherCountry = false;
    this.configOption1.outputFormat = OutputOptionsEnum.Number;
    // this.selectedCountryList.push(new CustomCountryModel(){ Name="Test2", ISOCode="IN"});
    setTimeout(() => {
      this.GetFormValue();
    }, 100);
  }

  ToggbleEnableDisableState() {
    if (this.sampleForm.controls['sampleReactiveControl'].disabled) {
      this.sampleForm.controls['sampleReactiveControl'].enable();
    } else {
      this.sampleForm.controls['sampleReactiveControl'].disable();
    }
  }

  GetFormValue() {
    let selectedCountryValue: NumberResult = {
      countryModel: {
        isoCode: 'US',
        countryPhoneCode: '+1',
        flagCssClass: '',
        inputMasking: '',
        name: '',
        isShowCustomFlag: false,
      },
      number: '+1 (860) 260-5928',
      rawNumber: '8602605928',
    };
    this.sampleForm.controls['sampleReactiveControl'].setValue(
      selectedCountryValue
    );
    console.log('form value is ', this.sampleForm);
  }

  onNumberChange(e: any) {
    console.log('Number Value is', e);
  }

  get controls() {
    return this.sampleForm.controls;
  }
}
