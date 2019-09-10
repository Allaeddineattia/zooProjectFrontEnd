import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  @Input() post;

  ngOnInit() {
    console.log('post:', this.post);
  }

  getImage(image: Blob) {
    const objectURL = URL.createObjectURL(image);
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  getTitle( p) {
    console.log(p);
    return this.post['title'];
  }

}
