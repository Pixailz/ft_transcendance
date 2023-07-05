import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingcomponentComponent } from './landingcomponent.component';

describe('LandingcomponentComponent', () => {
  let component: LandingcomponentComponent;
  let fixture: ComponentFixture<LandingcomponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingcomponentComponent]
    });
    fixture = TestBed.createComponent(LandingcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
