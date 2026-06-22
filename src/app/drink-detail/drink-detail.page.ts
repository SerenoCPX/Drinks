import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CocktailService } from '../services/cocktail.service';
import { FavoriteService } from '../services/favorite.service';
import { Drink } from '../models/drink.model';

@Component({
  selector: 'app-drink-detail',
  templateUrl: './drink-detail.page.html',
  styleUrls: ['./drink-detail.page.scss'],
  standalone: false,
})
export class DrinkDetailPage implements OnInit {
  drink: Drink | null = null;
  ingredients: { name: string; measure: string }[] = [];
  loading = false;
  rating = 5;
  notes = '';
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private cocktailService: CocktailService,
    private favoriteService: FavoriteService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  load(id: string) {
    this.loading = true;
    this.cocktailService.getById(id).subscribe({
      next: (drink) => {
        this.drink = drink;
        this.ingredients = drink ? this.cocktailService.getIngredients(drink) : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async saveFavorite() {
    if (!this.drink) return;
    this.saving = true;
    try {
      await this.favoriteService.add({
        idDrink: this.drink.idDrink,
        name: this.drink.strDrink,
        image: this.drink.strDrinkThumb,
        category: this.drink.strCategory || '',
        rating: this.rating,
        notes: this.notes,
        createdAt: Date.now(),
      });
      await this.showToast('Adicionado aos favoritos!', 'success');
      this.notes = '';
      this.rating = 5;
    } catch (e) {
      await this.showToast('Erro ao salvar. Verifique a configuracao do Firebase.', 'danger');
    } finally {
      this.saving = false;
    }
  }

  private async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
