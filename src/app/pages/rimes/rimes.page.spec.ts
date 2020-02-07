import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RimesPage } from 'src/app/pages/rimes/rimes.page';

describe('RimesPage', () => {
  let component: RimesPage;
  let fixture: ComponentFixture<RimesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RimesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RimesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  
});
