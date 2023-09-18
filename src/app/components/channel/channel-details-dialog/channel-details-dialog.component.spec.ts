import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDetailsDialogComponent } from './channel-details-dialog.component';

describe('ChannelDetailsDialogComponent', () => {
  let component: ChannelDetailsDialogComponent;
  let fixture: ComponentFixture<ChannelDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
