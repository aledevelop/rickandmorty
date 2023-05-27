import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrillaService } from 'src/app/services/grilla.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule ],
  template: `
    <div *ngIf="this.character()?.id == this.character_id" class="container">
      <mat-card class="character-card">
        <mat-card-header>
          <div mat-card-avatar><img width="45" height="45" src="{{character()?.image}}" /></div>
          <mat-card-title>{{character()?.name}}</mat-card-title>
          <mat-card-subtitle>{{character()?.status}}</mat-card-subtitle>
        </mat-card-header>
        <img mat-card-image src="{{character()?.image}}" alt="image">
        <mat-card-content>
          <p>Specie: {{character()?.species}}</p>
          <p>Gender: {{character()?.gender}}</p>
          <p>Origin: {{character()?.origin?.name}}</p>
        </mat-card-content>
        <mat-card-actions>
          <button [routerLink]="['/']" routerLinkActive="router-link-active"  mat-button>Back</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 40px;
    }

    .character-card {
      max-width: 400px;
    }
  `]
})
export default class CharacterComponent implements OnInit {

  @Input() character_id: string | undefined; // esto es un path param

  grillaSvc = inject(GrillaService);

  character = this.grillaSvc.selectedCharacter;

  ngOnInit(): void {
    if (this.character_id) {
      this.grillaSvc.setCharacter(this.character_id);
    }
  }

}
