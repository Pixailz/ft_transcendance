import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatButtonComponent } from './flat-button.component';

describe('FlatButtonComponent', () => {
  let component: FlatButtonComponent;
  let fixture: ComponentFixture<FlatButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlatButtonComponent]
    });
    fixture = TestBed.createComponent(FlatButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
