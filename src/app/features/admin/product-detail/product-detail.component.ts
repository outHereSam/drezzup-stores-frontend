import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product } from '../../../core/models/product.model';
import { ProductsService } from '../../../core/services/products.service';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ChevronLeft,
  Trash2Icon,
  EllipsisIcon,
  PencilIcon,
} from 'lucide-angular';
import { ZeroPadPipe } from '../../../shared/pipes/zero-pad.pipe';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, LucideAngularModule, ZeroPadPipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  selectedId!: number;
  product$!: Observable<Product>;
  isOptionsOpened: boolean = false;

  readonly ChevronLeft = ChevronLeft;
  readonly Trash2Icon = Trash2Icon;
  readonly EllipsisIcon = EllipsisIcon;
  readonly PencilIcon = PencilIcon;

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = Number(params.get('productId'));
        return this.productsService.getProductById(this.selectedId);
      })
    );
  }

  toggleOptions(): void {
    this.isOptionsOpened = !this.isOptionsOpened;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.options') && !target.closest('.menu_options')) {
      this.isOptionsOpened = false;
    }
  }
}
