import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm:string = '';
  constructor(private router:Router, actRoute:ActivatedRoute){
    actRoute.params.subscribe((params)=>{
      if(params.searchTerm) 
      this.searchTerm = params.searchTerm;
    });
  }
  search(term:string){
    if(term)
    this.router.navigateByUrl('/search/' + term);
  }
}
