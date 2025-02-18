import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';
import { FooterComponent } from '../shared/components/footer/footer.component';

@Component({
  selector: 'app-homepage',
  imports: [HeaderComponent, ProductCardComponent, FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass',
})
export class HomepageComponent {}
