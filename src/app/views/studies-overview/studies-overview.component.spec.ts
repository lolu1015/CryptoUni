import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiesOverviewComponent } from './studies-overview.component';

describe('StudiesOverviewComponent', () => {
  let component: StudiesOverviewComponent;
  let fixture: ComponentFixture<StudiesOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
