import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastSupplierComponent } from './toast-supplier.component';

describe('ToastSupplierComponent', () => {
  let component: ToastSupplierComponent;
  let fixture: ComponentFixture<ToastSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastSupplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
