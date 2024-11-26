import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BASE_URL } from '../../../shared/models/constants/urls';

@Component({
  selector: 'app-schemes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schemes.component.html',
  styleUrl: './schemes.component.css'
})
export class SchemesComponent implements OnInit{
  base = BASE_URL;
  ngOnInit(): void {

  }
  scheme1: boolean = false;
  scheme2: boolean = false;
  scheme3: boolean = true;
  scheme11() {
    this.scheme1 = true;
    this.scheme2 = false;
    this.scheme3 = false;
  }
  scheme12() {
    this.scheme2 = true;
    this.scheme1 = false;
    this.scheme3 = false;
  }
  scheme13() {
    this.scheme3 = true;
    this.scheme1 = false;
    this.scheme2 = false;
  }
}