import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSuccessSignUpMessageComponent } from './dialog-success-sign-up-message.component';

describe('DialogSuccessSignUpMessageComponent', () => {
  let component: DialogSuccessSignUpMessageComponent;
  let fixture: ComponentFixture<DialogSuccessSignUpMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSuccessSignUpMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSuccessSignUpMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
