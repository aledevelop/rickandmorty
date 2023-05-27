import { ComponentFixture, TestBed } from '@angular/core/testing';

import GrillaComponent from './grilla.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GrillaComponent', () => {
  let component: GrillaComponent;
  let fixture: ComponentFixture<GrillaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GrillaComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(GrillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
