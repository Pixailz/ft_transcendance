import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinChatRoomComponent } from './join-chat-room.component';

describe('JoinChatRoomComponent', () => {
  let component: JoinChatRoomComponent;
  let fixture: ComponentFixture<JoinChatRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinChatRoomComponent]
    });
    fixture = TestBed.createComponent(JoinChatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
