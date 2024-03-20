import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesVendedorComponent } from './ventas-mensajes.component';

describe('MensajesVendedorComponent', () => {
  let component: MensajesVendedorComponent;
  let fixture: ComponentFixture<MensajesVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajesVendedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensajesVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
