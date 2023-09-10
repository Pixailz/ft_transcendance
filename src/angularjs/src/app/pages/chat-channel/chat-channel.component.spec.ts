import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WSChatChannelComponent } from './chat-channel.component';

describe('UserProfileComponent', () => {
  let component: WSChatChannelComponent;
  let fixture: ComponentFixture<WSChatChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WSChatChannelComponent]
    });
    fixture = TestBed.createComponent(WSChatChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
