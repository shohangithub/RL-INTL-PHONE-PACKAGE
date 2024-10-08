import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RlIntlPhoneComponent } from './rl-intl-phone.component';

describe('RlIntlPhoneComponent', () => {
  let component: RlIntlPhoneComponent;
  let fixture: ComponentFixture<RlIntlPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RlIntlPhoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RlIntlPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
