import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDmComponent } from './new-dm.component';

describe('NewDmComponent', () => {
  let component: NewDmComponent;
  let fixture: ComponentFixture<NewDmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDmComponent]
    });
    fixture = TestBed.createComponent(NewDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
