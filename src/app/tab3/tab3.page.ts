import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FavoriteService } from '../services/favorite.service';
import { Favorite } from '../models/drink.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  favorites$!: Observable<Favorite[]>;

  constructor(
    private favoriteService: FavoriteService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.favorites$ = this.favoriteService.list();
  }

  async editFavorite(fav: Favorite) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Favorito',
      subHeader: fav.name,
      inputs: [
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          value: fav.rating,
          placeholder: 'Avaliacao (1-5)',
        },
        {
          name: 'notes',
          type: 'textarea',
          value: fav.notes,
          placeholder: 'Anotacao',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            const rating = Math.min(5, Math.max(1, Number(data.rating) || 1));
            try {
              await this.favoriteService.update(fav.id!, {
                rating,
                notes: data.notes || '',
              });
              await this.showToast('Favorito atualizado!', 'success');
            } catch {
              await this.showToast('Erro ao atualizar.', 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async removeFavorite(fav: Favorite) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Favorito',
      message: `Deseja remover "${fav.name}" dos favoritos?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destructive',
          handler: async () => {
            try {
              await this.favoriteService.remove(fav.id!);
              await this.showToast('Favorito removido!', 'success');
            } catch {
              await this.showToast('Erro ao remover.', 'danger');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  trackById(_: number, item: Favorite) {
    return item.id;
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
