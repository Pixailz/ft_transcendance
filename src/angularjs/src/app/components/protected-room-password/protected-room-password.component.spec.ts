import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectedRoomPasswordComponent } from './protected-room-password.component';

describe('ProtectedRoomPasswordComponent', () => {
  let component: ProtectedRoomPasswordComponent;
  let fixture: ComponentFixture<ProtectedRoomPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProtectedRoomPasswordComponent]
    });
    fixture = TestBed.createComponent(ProtectedRoomPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
