import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroUploadComponent } from './micro-upload.component';

describe('MicroUploadComponent', () => {
  let component: MicroUploadComponent;
  let fixture: ComponentFixture<MicroUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
