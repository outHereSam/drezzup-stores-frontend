import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (c) => c.RegisterComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./homepage/homepage.component').then((c) => c.HomepageComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/analytics/analytics.component').then(
            (c) => c.AnalyticsComponent
          ),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/admin/inventory/inventory.component').then(
            (c) => c.InventoryComponent
          ),
      },
      {
        path: 'inventory/:productId',
        loadComponent: () =>
          import(
            './features/admin/product-detail/product-detail.component'
          ).then((c) => c.ProductDetailComponent),
      },

      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
      },
      {
        path: 'brands',
        loadComponent: () =>
          import('./features/admin/brands/brands.component').then(
            (c) => c.BrandsComponent
          ),
      },
      {
        path: 'models',
        loadComponent: () =>
          import('./features/admin/models/models.component').then(
            (c) => c.ModelsComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
      },
    ],
  },
  {
    path: 'products/:categoryName',
    loadComponent: () =>
      import('./products/products.component').then((c) => c.ProductsComponent),
  },
  {
    path: 'products/:categoryName/:productId',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(
        (c) => c.ProductDetailComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/components/cart/cart.component').then(
        (c) => c.CartComponent
      ),
  },
];
