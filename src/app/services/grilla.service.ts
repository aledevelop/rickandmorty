import { Injectable, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrillaService {

  private http = inject(HttpClient);

  totalPages = signal(0);

  loading = signal(true);

  totalCharacters = signal(0);

  private options = signal<GridSearch>({ page: 0, filter: '' });

  private characterId = signal<string>('');

  private characters$ = toObservable(this.options).pipe(
    switchMap(options => this.getCharacters(options.page, options.filter))
  )
  characters = toSignal(this.characters$, { initialValue: [] });


  private selectedCharacter$ = toObservable(this.characterId).pipe(
    switchMap(id => this.getCharacter(id))
  )
  selectedCharacter = toSignal<Character>(this.selectedCharacter$);

  search(page: number = 0, filter: string): void {
    this.options.set({ page: page, filter: filter });
  }

  setCharacter(id: string): void {
    this.characterId.set(id);
  }

  private getCharacters(page: number, filter: string = ''): Observable<Character[]> {
    this.loading.set(true);
    return this.http.get<RickMorty>(`https://rickandmortyapi.com/api/character/?page=${page+1}&name=${filter}`)
    .pipe(
      delay(200),
      map(res => {
        this.totalPages.set(res.info.pages);
        this.totalCharacters.set(res.info.count);
        this.loading.set(false);
        return res.results
      }),
      catchError((error) => {
        console.log('Error -> ' + error);
        this.loading.set(false);
        return of([]);
      })
    );
  }

  private getCharacter(id: string) {
    this.loading.set(true);
    return this.http.get<Character>(`https://rickandmortyapi.com/api/character/${id}`)
    .pipe(
      delay(200),
      map(res => {
        this.loading.set(false);
        return res;
      }),
      catchError((error) => {
        console.log('Error -> ' + error);
        this.loading.set(false);
        return of();
      })
    );
  }

}


export interface RickMorty {
  info: Info;
  results: Character[];
}

export interface Info {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

interface GridSearch {
  page : number;
  filter : string;
}
