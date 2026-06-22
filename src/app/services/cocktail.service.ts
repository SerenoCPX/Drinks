import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Drink, DrinkApiResponse } from '../models/drink.model';

@Injectable({ providedIn: 'root' })
export class CocktailService {
  private readonly baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  search(name: string): Observable<Drink[]> {
    const term = (name || '').trim();
    if (!term) return of([]);
    return this.http
      .get<DrinkApiResponse>(`${this.baseUrl}/search.php?s=${encodeURIComponent(term)}`)
      .pipe(map((res) => res.drinks ?? []));
  }

  random(): Observable<Drink | null> {
    return this.http
      .get<DrinkApiResponse>(`${this.baseUrl}/random.php`)
      .pipe(map((res) => (res.drinks && res.drinks[0]) || null));
  }

  getById(id: string): Observable<Drink | null> {
    return this.http
      .get<DrinkApiResponse>(`${this.baseUrl}/lookup.php?i=${encodeURIComponent(id)}`)
      .pipe(map((res) => (res.drinks && res.drinks[0]) || null));
  }

  getIngredients(drink: Drink): { name: string; measure: string }[] {
    const items: { name: string; measure: string }[] = [];
    for (let i = 1; i <= 15; i++) {
      const name = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (name && String(name).trim()) {
        items.push({ name: String(name).trim(), measure: measure ? String(measure).trim() : '' });
      }
    }
    return items;
  }
}
