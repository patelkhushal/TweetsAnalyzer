import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryProfilesComponent } from './query-profiles.component';

describe('QueryProfilesComponent', () => {
  let component: QueryProfilesComponent;
  let fixture: ComponentFixture<QueryProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
