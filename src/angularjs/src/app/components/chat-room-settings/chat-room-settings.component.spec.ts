import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomSettingsComponent } from './chat-room-settings.component';

describe('ChatRoomSettingsComponent', () => {
  let component: ChatRoomSettingsComponent;
  let fixture: ComponentFixture<ChatRoomSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomSettingsComponent]
    });
    fixture = TestBed.createComponent(ChatRoomSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
