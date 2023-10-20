import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatChannelFriendListComponent } from './chat-channel-friend-list.component';

describe('ChatChannelFriendListComponent', () => {
  let component: ChatChannelFriendListComponent;
  let fixture: ComponentFixture<ChatChannelFriendListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatChannelFriendListComponent]
    });
    fixture = TestBed.createComponent(ChatChannelFriendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
