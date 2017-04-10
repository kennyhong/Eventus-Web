import { AppComponent } from './app.component';
import { EventViewComponent } from './event-view/event-view.component';
import { EventListComponent } from './event-view/event-list/event-list.component';
import { EventDetailComponent } from './event-view/event-detail/event-detail.component';

import {} from '@types/jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterTestingModule} from '@angular/router/testing';
import { FormsModule }   from '@angular/forms';

describe('AppComponent', function () {
  let de: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        EventViewComponent,
        EventListComponent,
        EventDetailComponent
        ],
      imports: [
          RouterTestingModule,
          FormsModule
      ]
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
    expect(element.querySelectorAll('a')[1].innerText).toBe('Create Event');
  });
});
