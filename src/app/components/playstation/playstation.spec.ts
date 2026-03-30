import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playstation } from './playstation';

describe('Playstation', () => {
  let component: Playstation;
  let fixture: ComponentFixture<Playstation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playstation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Playstation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
