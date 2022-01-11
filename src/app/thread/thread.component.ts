import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  faTrash,
  faPen,
  faThumbsUp,
  faThumbsDown,
  faBan,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Thread } from '../models/thread.model';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { State } from '../enums/state.enum';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Content } from '../models/content.model';
import { AuthService } from '../services/auth.service';
import { ThreadService } from '../services/thread.service';
import { ContentType } from '../models/contentType.model';
import { ContentTypeService } from '../services/contentType.service';
import { CommentService } from '../services/comment.service';
import { LikeService } from '../services/like.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
})
export class ThreadComponent implements OnInit {
  faTrash = faTrash;
  faPen = faPen;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faBan = faBan;
  faUpload = faUpload;

  @Input() threadData!: Thread;
  categories: Category[] | undefined;
  contentTypes: ContentType[] | undefined;
  commentCount: number | undefined;
  user: User | undefined;
  likes: any;
  userLikes: any;

  State = State;
  @Input() state: State = this.State.Read;

  // for create only
  currentType: number | undefined;
  fileToUpload: File | null = null;

  // create form
  threadForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    category: new FormControl(''),
    contentType: new FormControl(''),
    contentTextText: new FormControl(''),
    contentTextImage: new FormControl(''),
    contentTextYoutube: new FormControl(''),
  });

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private contentTypeService: ContentTypeService,
    private userService: UserService,
    private authService: AuthService,
    private threadService: ThreadService,
    private commentService: CommentService,
    private likeService: LikeService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.threadForm.get('contentType')?.valueChanges.subscribe((res) => {
      this.currentType = parseInt(res);
    });
    this.getThreadLikes();
    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      this.threadForm.get('category')?.setValue(this.categories![0].id);
    });
    this.contentTypeService.getAllContentTypes().subscribe((contentTypes) => {
      this.contentTypes = contentTypes;
      this.threadForm.get('contentType')?.setValue(this.contentTypes![0].id);
    });
    this.getCommentCount();
    this.getUser();
  }

  // #region init

  getUser(): void {
    if (!this.threadData) return;
    this.userService
      .getUserById(this.threadData.content?.user_id!)
      .subscribe((user) => {
        this.user = user;
        this.getUserLikesThread();
      });
  }

  getCommentCount(): void {
    if (!this.threadData) return;
    this.commentService
      .getCommentCount(this.threadData.id!)
      .subscribe((res) => (this.commentCount = res.count));
  }

  getCategoryById(id: number): Category {
    return this.categories?.find((c) => c.id == id)!;
  }

  getContentTypeById(id: number): ContentType {
    return this.contentTypes?.find((c) => c.id == id)!;
  }

  identifyCategory(index: number, item: Category) {
    return item.id;
  }

  identifyContentType(index: number, item: ContentType) {
    return item.id;
  }

  isNewsfeed(): boolean {
    return this.router.url == '/newsfeed';
  }

  // #endregion init

  // #region create

  uploadFile(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    this.threadForm.patchValue({
      contentTextImage: file,
    });
    this.threadForm.get('contentTextImage')!.updateValueAndValidity();
  }

  @Output() createEvent: EventEmitter<Thread> = new EventEmitter();
  onCreateButton(): void {
    var userId = this.authService.getUserId();

    const content_type_id = this.currentType;

    let content_text = undefined;
    switch (content_type_id) {
      // text
      case 1:
        content_text = this.threadForm.get('contentTextText')?.value;
        break;
      // image, done in backend
      case 2:
        break;
      // youtube url
      case 3:
        content_text = this.threadForm.get('contentTextYoutube')?.value;
        break;
      default:
        break;
    }

    var content = new Content({
      user_id: userId!,
      content_type_id,
      content_text,
    });

    var thread = new Thread({
      title: this.threadForm.get('title')?.value,
      category_id: this.threadForm.get('category')?.value,
      content: content,
    });

    this.threadService
      .createThread(thread, this.threadForm.get('contentTextImage')?.value)
      .subscribe((success) => {
        this.threadForm.reset();
        this.threadForm.get('category')?.setValue(this.categories![0].id);
        this.threadForm.get('contentType')?.setValue(this.contentTypes![0].id);
        this.threadService
          .getOneThread(success.id)
          .subscribe((thread) => this.createEvent.emit(thread));
      });
  }

  // #endregion create

  // #region read

  onUpdateButton(): void {
    this.state = State.Update;
    this.threadForm.get('title')?.setValue(this.threadData.title);
    this.threadForm.get('category')?.setValue(this.threadData.category_id);
    this.threadForm
      .get('contentType')
      ?.setValue(this.threadData.content?.content_type_id);
    switch (this.threadData.content?.content_type_id) {
      case 1:
        this.threadForm
          .get('contentTextText')
          ?.setValue(this.threadData.content?.content_text);
        break;
      case 2:
        this.threadForm
          .get('contentTextImage')
          ?.setValue(this.threadData.content?.content_text);
        break;
      case 3:
        this.threadForm
          .get('contentTextYoutube')
          ?.setValue(this.threadData.content?.content_text);
        break;
      default:
        break;
    }
  }

  @Output() deleteEvent: EventEmitter<Thread> = new EventEmitter();
  onDeleteButton(): void {
    if (confirm('Êtes-vous sûr(e) de vouloir supprimer ce thread ?')) {
      this.threadService
        .deleteThread(this.threadData.id!)
        .subscribe((success) => {
          this.deleteEvent.emit(this.threadData);
        });
    }
  }

  onModerateButton(): void {
    if (confirm('Êtes-vous sûr(e) de vouloir modérer ce thread ?')) {
      this.threadService
        .moderateThread(this.threadData.id!)
        .subscribe((success) => {
          this.deleteEvent.emit(this.threadData);
        });
    }
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isOwner(): boolean {
    return this.authService.getUserId() == this.threadData.content?.user_id;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onThreadDetail(): void {
    this.router.navigate(['thread/' + this.threadData.id]);
  }

  // #endregion read

  // #region update

  cancelUpdate() {
    this.state = State.Read;
  }

  update(): void {
    var threadId = this.threadData.id;

    let content_type_id = this.currentType;
    let content_text = undefined;
    switch (content_type_id) {
      // text
      case 1:
        content_text = this.threadForm.get('contentTextText')?.value;
        break;
      // image, done in backend
      case 2:
        break;
      // youtube url
      case 3:
        content_text = this.threadForm.get('contentTextYoutube')?.value;
        break;
      default:
        break;
    }

    var content = new Content({
      content_type_id,
      content_text,
    });

    var thread = new Thread({
      title: this.threadForm.get('title')?.value,
      category_id: this.threadForm.get('category')?.value,
      content: content,
    });

    this.threadService
      .updateThread(
        threadId!,
        thread,
        this.threadForm.get('contentTextImage')?.value
      )
      .subscribe((success) => {
        this.threadService.getOneThread(threadId!).subscribe((thread) => {
          this.threadData = thread;
          this.state = State.Read;
        });
      });
  }

  // #endregion update

  // #region likes

  getThreadLikes() {
    if (!this.threadData) return;
    this.likeService.getThreadLikes(this.threadData.id!).subscribe((res) => {
      this.likes = res;
    });
  }

  getUserLikesThread() {
    var userId = this.authService.getUserId();
    this.likeService
      .getUserLikesOnThread(this.threadData.id!, userId!)
      .subscribe((res) => {
        this.userLikes = res;
      });
  }

  like(): void {
    this.likeService.likeThread(this.threadData.id!, 1).subscribe((success) => {
      this.getUserLikesThread();
      this.getThreadLikes();
    });
  }

  dislike(): void {
    this.likeService
      .likeThread(this.threadData.id!, -1)
      .subscribe((success) => {
        this.getUserLikesThread();
        this.getThreadLikes();
      });
  }

  unlike(): void {
    this.likeService.likeThread(this.threadData.id!, 0).subscribe((success) => {
      this.getUserLikesThread();
      this.getThreadLikes();
    });
  }

  // #endregion likes
}
