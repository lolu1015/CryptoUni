import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakenCoursesComponent } from './taken-courses.component';

describe('TakenCoursesComponent', () => {
  let component: TakenCoursesComponent;
  let fixture: ComponentFixture<TakenCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakenCoursesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakenCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
