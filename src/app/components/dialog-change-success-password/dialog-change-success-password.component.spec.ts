import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeSuccessPasswordComponent } from './dialog-change-success-password.component';

describe('DialogChangeSuccessPasswordComponent', () => {
  let component: DialogChangeSuccessPasswordComponent;
  let fixture: ComponentFixture<DialogChangeSuccessPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChangeSuccessPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogChangeSuccessPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
