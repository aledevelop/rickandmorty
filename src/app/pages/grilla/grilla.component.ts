import { AfterViewInit, Component, ViewChild, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GrillaService } from 'src/app/services/grilla.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Character } from '../../services/grilla.service';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-grilla',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, FormsModule],
  template: `
    <div class="container">

      <div class="search-container">
        <input placeholder="Search..." type="text" (keyup)="search($event)" />
      </div>

      <table mat-table [dataSource]="characters()">

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td class="column_image" mat-cell *matCellDef="let row"><img width="30" height="30" src="{{row.image}}" />&nbsp;&nbsp;<span>{{row.name}}</span></td>
        </ng-container>

        <ng-container matColumnDef="species">
          <th mat-header-cell *matHeaderCellDef>Species</th>
          <td mat-cell *matCellDef="let row">{{row.species}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let row">{{row.status}}</td>
        </ng-container>

        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let row">{{row.type}}</td>
        </ng-container>

        <ng-container matColumnDef="gender">
          <th mat-header-cell *matHeaderCellDef>Gender</th>
          <td mat-cell *matCellDef="let row">{{row.gender}}</td>
        </ng-container>

        <ng-container matColumnDef="origin">
          <th mat-header-cell *matHeaderCellDef>Origin</th>
          <td mat-cell *matCellDef="let row">{{row.origin.name}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="selectCharacter(row)"></tr>
      </table>

      <div class="loading" *ngIf="this.loading()"><mat-spinner /></div>

      <mat-paginator [length]="this.total()" pageSize="20" pageIndex="0" showFirstLastButtons />

    </div>
  `,
  styleUrls: ['./grilla.component.scss']
})
export default class GrillaComponent implements AfterViewInit {

  grillaSvc = inject(GrillaService);

  router = inject(Router);

  displayedColumns = ['name', 'species', 'status', 'type', 'gender', 'origin']

  characters = this.grillaSvc.characters;

  total = this.grillaSvc.totalCharacters;

  loading = this.grillaSvc.loading;

  // Convierto el signal 'textSearch' al observable 'textSearch$' para agregar una demora y distinguir cambios
  // Después vuelvo a convertir el observable en un signal 'filter'
  textSearch = signal('');
  textSearch$ = toObservable(this.textSearch).pipe(debounceTime(500), distinctUntilChanged());
  filter = toSignal<string, string>(this.textSearch$, {initialValue: ''});

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor() {

    effect(() => {
      this.paginator.pageIndex = 0;
      this.grillaSvc.search(this.paginator?.pageIndex, this.filter());
    }, { allowSignalWrites: true })


  }

  ngAfterViewInit(): void {

    this.paginator?.page.subscribe(() => {
      this.grillaSvc.search(this.paginator?.pageIndex, this.filter());
    })

  }

  search(evt: any) {
    this.textSearch.set(evt.target.value);
  }

  selectCharacter(character: Character) {
    this.router.navigate(['/character', character.id]);
  }

}

