import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendResetMailSuccessComponent } from './dialog-send-reset-mail-success.component';

describe('DialogSendResetMailSuccessComponent', () => {
  let component: DialogSendResetMailSuccessComponent;
  let fixture: ComponentFixture<DialogSendResetMailSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSendResetMailSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSendResetMailSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
