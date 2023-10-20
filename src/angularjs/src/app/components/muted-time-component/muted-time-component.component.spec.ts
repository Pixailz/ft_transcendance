import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutedTimeComponentComponent } from './muted-time-component.component';

describe('MutedTimeComponentComponent', () => {
  let component: MutedTimeComponentComponent;
  let fixture: ComponentFixture<MutedTimeComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MutedTimeComponentComponent]
    });
    fixture = TestBed.createComponent(MutedTimeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
