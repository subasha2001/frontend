import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appnext]',
  standalone: true
})
export class NextDirective {

  constructor(private el:ElementRef) {
    
  }

  @HostListener('click') next(){
    alert(elm);
    var elm = this.el.nativeElement.parentElement.parentElement.children[0]; 
    var item = elm.getElementsByClassName('item');
    elm.append(item[0]);
  }
}
