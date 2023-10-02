import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivChatPageComponent } from './priv-chat-page.component';

describe('PrivChatPageComponent', () => {
  let component: PrivChatPageComponent;
  let fixture: ComponentFixture<PrivChatPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivChatPageComponent]
    });
    fixture = TestBed.createComponent(PrivChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
