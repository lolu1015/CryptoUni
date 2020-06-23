import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplOverviewComponent } from './appl-overview.component';

describe('ApplOverviewComponent', () => {
  let component: ApplOverviewComponent;
  let fixture: ComponentFixture<ApplOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
