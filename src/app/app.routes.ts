import { Routes } from '@angular/router';

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
      import('./features/home/home/home.component').then(
        (c) => c.HomeComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
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
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
      },
    ],
  },
];
