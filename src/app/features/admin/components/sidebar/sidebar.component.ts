import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.sass',
})
export class SidebarComponent implements OnInit {
  user: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const decodedToken = this.authService.getDecodedAccessToken();

    if (decodedToken?.email) {
      this.userService.getUserByEmail(decodedToken.email).subscribe({
        next: (response) => {
          this.user = response.user;
        },
        error: (error) => {
          // Handle error silently
        },
      });
    }
  }
}
