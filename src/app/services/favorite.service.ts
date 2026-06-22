import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Favorite } from '../models/drink.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private firestore = inject(Firestore);
  private readonly collectionName = 'favorites';

  list(): Observable<Favorite[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Favorite[]>;
  }

  add(favorite: Omit<Favorite, 'id'>) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, favorite);
  }

  update(id: string, data: Partial<Favorite>) {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(ref, data);
  }

  remove(id: string) {
    const ref = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(ref);
  }
}
