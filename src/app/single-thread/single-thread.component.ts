import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../models/comment.model';
import { Thread } from '../models/thread.model';
import { CommentService } from '../services/comment.service';
import { ThreadService } from '../services/thread.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { State } from '../enums/state.enum';
import { ThreadComponent } from '../thread/thread.component';

@Component({
  selector: 'app-single-thread',
  templateUrl: './single-thread.component.html',
  styleUrls: ['./single-thread.component.scss'],
})
export class SingleThreadComponent implements OnInit {
  faArrowLeft = faArrowLeft;
  State = State;

  @ViewChild(ThreadComponent) threadChild: ThreadComponent | undefined;
  threadId: number | undefined;
  thread: Thread | undefined;
  isThreadAvailable = true;

  comments: Comment[] = [];

  // pagination
  page: number = 0;
  perPage: number = 8;
  nextPage: number | undefined;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private threadService: ThreadService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.threadId = this.route.snapshot.params['threadId'];
    this.getThread();
    this.getMoreComments();
  }

  getThread(): void {
    this.threadService.getOneThread(this.threadId!).subscribe(
      (thread) => (this.thread = thread),
      (err) => {
        this.isThreadAvailable = false;
      }
    );
  }

  getMoreComments(): void {
    this.loading = true;
    this.commentService
      .getAllComments(this.threadId!, this.page, this.perPage)
      .subscribe((res) => {
        this.nextPage = res.next;
        this.comments = [...this.comments, ...res.comments];
        this.loading = false;
      });
  }

  createComment(comment: Comment) {
    this.comments = [comment, ...this.comments];
    this.updateCommentCount();
  }

  deleteComment(comment: Comment) {
    this.comments = this.comments.filter((x) => x.id != comment.id);
    this.updateCommentCount();
  }

  // delete event coming from child
  deleteThread(thread: Thread) {
    this.router.navigate(['newsfeed']);
  }

  updateCommentCount(): void {
    this.threadChild?.getCommentCount();
  }

  back(): void {
    this.router.navigate(['newsfeed']);
  }

  // check if the distance from a bottom requires to load more threads
  @HostListener('window:scroll')
  onScroll(): void {
    const distance = this.distanceFromBottom();
    if (distance < 500 && this.nextPage && !this.loading) {
      this.page = this.nextPage;
      this.getMoreComments();
    }
  }

  distanceFromBottom() {
    var scrollPosition = window.pageYOffset;
    var windowSize = window.innerHeight;
    var bodyHeight = document.body.offsetHeight;
    return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
  }
}
