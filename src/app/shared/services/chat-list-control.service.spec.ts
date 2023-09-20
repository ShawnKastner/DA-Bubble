import { TestBed } from '@angular/core/testing';

import { ChatListControlService } from './chat-list-control.service';

describe('ChatListControlService', () => {
  let service: ChatListControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatListControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
