import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { jewelleryType } from '../../../shared/models/productType';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit{
  searchTerm: string = '';
  // products:jewelleryType[] = [];
  constructor(private router: Router, actRoute: ActivatedRoute, private eRef:ElementRef, private productservice:ProductsService) {
    actRoute.params.subscribe((params) => {
      if (params.searchTerm) this.searchTerm = params.searchTerm;
    });
  }
  ngOnInit(): void {
    // this.loadProducts();
  }
  search(term: string) {
    if (term) this.router.navigateByUrl('/search/' + term);
  }
  // private loadProducts(){
  //   this.productservice.getAllProducts().subscribe((val)=>{
  //     this.products = val;
  //   })
  // }

  showSearch = false;
  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (this.showSearch && !this.eRef.nativeElement.contains(targetElement)) {
      this.showSearch = false;
    }
  }
}