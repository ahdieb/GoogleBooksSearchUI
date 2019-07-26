import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

// Service
import { HttpRequestsService } from './services/http-request.service';

// Components
import { BookModalComponent } from './components/book-modal/book-modal.component';
import { NgxUiLoaderService, Loader } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() loader: Loader;

  public searchInput = new FormControl();
  searchValue = '';

  books: any[] = [];
  pageNumber = 0;

  // Scroll Options
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  constructor(private ngxUiLoaderService: NgxUiLoaderService, private httpRequest: HttpRequestsService, public dialog: MatDialog, ) { }

  ngOnInit() {
    this.getBooks(false);
    this.inputSearchListener();
  }

  inputSearchListener() {
    this.searchInput.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()).subscribe((keyword: string) => {
        this.pageNumber = 0;
        const trimmedKeyword = keyword.trim();
        if (keyword && trimmedKeyword.length > 0) {
          this.searchValue = trimmedKeyword;
          this.getBooks(false);
        } else {
          this.searchValue = '';
          this.getBooks(false);
        }
      });
  }

  getBooks(fromLoadMore) {
    this.ngxUiLoaderService.start();

    this.httpRequest.getBooksByTerm(this.searchValue, this.pageNumber).subscribe((books: any) => {
      this.ngxUiLoaderService.stop();
      if (fromLoadMore) {
        if (books.items) {
          books.items.forEach(book => {
            this.books.push(book);
          });
        }
      } else {
        this.books = books.items ? books.items : [];
      }
    }, error => {
      this.ngxUiLoaderService.stop();
      console.error('News Error', error);
    });
  }

  openDialog(book: any): void {
    this.dialog.open(BookModalComponent, {
      width: '500px',
      data: book
    });
  }

  onScrollpendingCards() {
    this.pageNumber = this.pageNumber + 1;
    this.getBooks(true);
  }


}
