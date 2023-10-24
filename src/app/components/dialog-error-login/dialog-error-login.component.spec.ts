import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogErrorLoginComponent } from './dialog-error-login.component';

describe('DialogErrorLoginComponent', () => {
  let component: DialogErrorLoginComponent;
  let fixture: ComponentFixture<DialogErrorLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogErrorLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogErrorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
