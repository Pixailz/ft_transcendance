import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendReqComponent } from './friend-req.component';

describe('FriendReqComponent', () => {
  let component: FriendReqComponent;
  let fixture: ComponentFixture<FriendReqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendReqComponent]
    });
    fixture = TestBed.createComponent(FriendReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
