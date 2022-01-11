import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thread } from '../models/thread.model';
import { ThreadService } from '../services/thread.service';
import { State } from '../enums/state.enum';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {
  threads: Thread[] = [];

  State = State;

  // pagination
  page: number = 0;
  perPage: number = 5;
  nextPage: number | undefined;

  currentCategory: number = -1;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private threadServices: ThreadService
  ) {}

  ngOnInit(): void {
    this.getMoreThreads();
  }

  getMoreThreads(): void {
    this.loading = true;
    if (this.currentCategory == -1) {
      this.threadServices
        .getAllThreads(this.page, this.perPage)
        .subscribe((res) => {
          this.nextPage = res.next;
          this.threads = [...this.threads, ...res.threads];
          this.loading = false;
        });
    } else {
      this.threadServices
        .getAllThreadsByCategory(this.page, this.perPage, this.currentCategory)
        .subscribe((res) => {
          this.nextPage = res.next;
          this.threads = [...this.threads, ...res.threads];
          this.loading = false;
        });
    }
  }

  // category changed event coming from navbar component
  onCategoryChanged(category: number) {
    this.currentCategory = category;

    this.threads = [];
    this.getMoreThreads();
  }

  // delete event coming from child
  deleteThread(thread: Thread) {
    this.threads = this.threads!.filter((x) => x.id !== thread.id);
  }

  // create event coming from the create form
  createThread(thread: Thread) {
    this.threads = [thread, ...this.threads];
  }

  // check if the distance from a bottom requires to load more threads
  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    if (this.distanceFromBottom() < 500 && this.nextPage && !this.loading) {
      this.page = this.nextPage;
      this.getMoreThreads();
    }
  }

  distanceFromBottom() {
    var scrollPosition = window.pageYOffset;
    var windowSize = window.innerHeight;
    var bodyHeight = document.body.offsetHeight;
    return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
  }
}
