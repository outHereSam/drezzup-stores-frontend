import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-homepage',
  imports: [HeaderComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass',
})
export class HomepageComponent {}
