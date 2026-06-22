import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CocktailService } from '../services/cocktail.service';
import { Drink } from '../models/drink.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  drink: Drink | null = null;
  loading = false;

  constructor(private cocktailService: CocktailService, private router: Router) {}

  ngOnInit() {
    this.loadRandom();
  }

  loadRandom() {
    this.loading = true;
    this.cocktailService.random().subscribe({
      next: (drink) => {
        this.drink = drink;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openDetails() {
    if (this.drink) {
      this.router.navigate(['/drink', this.drink.idDrink]);
    }
  }
}
