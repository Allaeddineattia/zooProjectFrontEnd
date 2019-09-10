import { PostService } from './../_services/post.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  form: FormGroup;

  file: any;

  constructor(private postService: PostService) { }

  posts = [];

  ngOnInit() {
    this.postService.allPosts.subscribe(res => this.posts = res);
    this.initSignUpForm();
  }

  initSignUpForm() {
    this.form = new FormGroup({
      title : new FormControl(null, [Validators.required], []),
      file : new FormControl(null, [Validators.required], []),
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log('selected file: ', file);
      this.file = file;
    }
  }

  submit() {
    console.log('form result: ', this.form.get('file'));
    this.postService.uploadImage(this.file, this.form.get('title').value).subscribe(
      res => location.reload()
    );
  }

}
