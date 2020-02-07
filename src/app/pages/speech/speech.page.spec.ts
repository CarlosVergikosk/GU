import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechPage } from 'src/app/pages/speech/speech.page';

describe('SpeechPage', () => {
  let component: SpeechPage;
  let fixture: ComponentFixture<SpeechPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  
});
