/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TwofaformComponent } from './twofaform.component';

describe('TwofaformComponent', () => {
  let component: TwofaformComponent;
  let fixture: ComponentFixture<TwofaformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwofaformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwofaformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
