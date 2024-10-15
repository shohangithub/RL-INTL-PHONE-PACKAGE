import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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
  configOption4: ConfigurationOptions;
  sampleForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.sampleForm = this.formBuilder.group({
      phone: [],
      phone1: [null],
      formArray: this.formBuilder.array(
        [].map(() => this.createChildForm())
      ),
    });

    this.selectedCountryList.push({
      isoCode: 'TE',
      name: 'TEST',
      countryPhoneCode: '+39',
      customFlagUrl: '../assets/images.jpg',
      inputMasking: '999 999 9999',
    });
    this.selectedCountryList.push({ isoCode: 'IN', name: 'INDIATEST' });
    this.selectedCountryList.push({ isoCode: 'CA', name: 'CANADA' });
    this.configOption1 = new ConfigurationOptions();
    this.configOption2 = new ConfigurationOptions();

    this.configOption3 = new ConfigurationOptions();
    this.configOption3.selectorClass = 'Phone1';

    this.configOption4 = new ConfigurationOptions();
    this.configOption4.selectorClass = 'Phone2';

    this.configOption2.selectorClass = 'CountryInput1';
    this.configOption2.optionTextTypes = [];
    this.configOption2.optionTextTypes.push(ContentOptionsEnum.Flag);
    this.configOption2.optionTextTypes.push(ContentOptionsEnum.CountryName);

    this.configOption1.selectorClass = 'CountryInput2';
    this.configOption1.isShowAllOtherCountry = false;
    this.configOption1.outputFormat = OutputOptionsEnum.Number;
  }

  createChildForm(code?: string): FormGroup {
    return this.formBuilder.group({
      phoneNumber: [null, [Validators.required]],
    });
  }
  get singleParticipants(): FormArray {
    return this.sampleForm.get('formArray') as FormArray;
  }

  getPiFormControl(
    index: number,
    formArreyName: string,
    controlName: string
  ): FormControl {
    const formArray: FormArray = this.sampleForm.get(
      formArreyName
    ) as FormArray;
    const formGroup: FormGroup = formArray.at(index) as FormGroup;
    return formGroup.get(controlName) as FormControl;
  }

  ToggbleEnableDisableState() {
    if (this.sampleForm.controls['phone'].disabled) {
      this.sampleForm.controls['phone'].enable();
    } else {
      this.sampleForm.controls['phone'].disable();
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
    this.sampleForm.controls['phone'].setValue(selectedCountryValue);
    console.log('form value is ', this.sampleForm);
  }

  onNumberChange(e: any) {
    console.log(e);
    console.log('Number Value is', e);
  }

  onNumberChange1(e: any) {
    console.log('Number Value is', e);
  }

  get controls() {
    return this.sampleForm.controls;
  }
}
