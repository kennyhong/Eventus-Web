import { AppComponent } from './app.component';

import {} from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AppComponent', function () {
  let de: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
  });

  it('should create component', () => expect(comp).toBeDefined() );

  it('should correctly display the navbar', () => {
    fixture.detectChanges();
    let element = fixture.nativeElement;
    expect(element.querySelectorAll('a')[0].innerText).toBe('EVENTUS');
    expect(element.querySelectorAll('a')[1].innerText).toBe('New Event');
    expect(element.querySelector('input').type).toBe('text');
    expect(element.querySelector('button').type).toBe('submit');
  });
});
