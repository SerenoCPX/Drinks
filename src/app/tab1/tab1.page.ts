import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CocktailService } from '../services/cocktail.service';
import { Drink } from '../models/drink.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  searchTerm = '';
  drinks: Drink[] = [];
  loading = false;
  searched = false;

  constructor(private cocktailService: CocktailService, private router: Router) {}

  search() {
    const term = this.searchTerm.trim();
    if (!term) {
      this.drinks = [];
      this.searched = false;
      return;
    }
    this.loading = true;
    this.searched = true;
    this.cocktailService.search(term).subscribe({
      next: (drinks) => {
        this.drinks = drinks;
        this.loading = false;
      },
      error: () => {
        this.drinks = [];
        this.loading = false;
      },
    });
  }

  openDetails(drink: Drink) {
    this.router.navigate(['/drink', drink.idDrink]);
  }
}
