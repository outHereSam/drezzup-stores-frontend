import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  loading = signal(false);
  submitted = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted.set(true);

    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('');
      },
      error: (error) => {
        this.error.set(error.error?.message || 'An error occurred');
        this.loading.set(false);
      },
    });
  }
}
