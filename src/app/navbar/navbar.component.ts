import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../models/category.model';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  faBars = faBars;
  faTimes = faTimes;

  displayMenu = false;
  categories: Category[] | undefined;
  categoryForm = new FormGroup({
    category: new FormControl(''),
  });

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      this.categoryForm.get('category')?.setValue(-1);
    });
  }

  identifyCategory(index: number, item: Category) {
    return item.id;
  }

  @Output() categoryChangedEvent: EventEmitter<number> = new EventEmitter();
  onChange(): void {
    const value = this.categoryForm.get('category')?.value;
    this.categoryChangedEvent.emit(value);
  }

  toggleMenu(): void {
    this.displayMenu = !this.displayMenu;
  }

  onLogoutButton(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  onSettingsButton(): void {
    this.router.navigate(['settings']);
  }

  onDeleteAccountButton(): void {
    if (confirm('Êtes-vous sûr(e) de vouloir supprimer votre compte ?')) {
      this.userService
        .delete(this.authService.getUserId()!)
        .subscribe((success) => {
          this.authService.logout();
          this.router.navigate(['']);
        });
    }
  }

  isNewsfeed(): boolean {
    return this.router.url == '/newsfeed';
  }
}
