import { TestBed } from '@angular/core/testing';

import { TextEditorFunctionsService } from './text-editor-functions.service';

describe('TextEditorFunctionsService', () => {
  let service: TextEditorFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextEditorFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
