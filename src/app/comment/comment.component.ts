import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  faTrash,
  faPen,
  faThumbsUp,
  faThumbsDown,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../models/comment.model';
import { State } from '../enums/state.enum';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Content } from '../models/content.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ContentType } from '../models/contentType.model';
import { ContentTypeService } from '../services/contentType.service';
import { CommentService } from '../services/comment.service';
import { LikeService } from '../services/like.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  faTrash = faTrash;
  faPen = faPen;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faBan = faBan;

  @Input()
  commentData!: Comment;
  user: User | undefined;
  contentTypes: ContentType[] | undefined;
  likes: any;
  userLikes: any;

  // create form
  commentForm = new FormGroup({
    contentType: new FormControl(''),
    contentText: new FormControl(''),
  });

  State = State;
  @Input() state: State = this.State.Read;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private contentTypeService: ContentTypeService,
    private commentService: CommentService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllContentTypes();
  }

  // init section

  getUser(): void {
    if (!this.commentData) return;
    this.userService.getUserById(this.commentData.user_id).subscribe((user) => {
      this.user = user;
      this.getCommentLikes();
      this.getUserLikesComment();
    });
  }

  getAllContentTypes(): void {
    this.contentTypeService.getAllContentTypes().subscribe((contentTypes) => {
      this.contentTypes = contentTypes;
      this.commentForm.get('contentType')?.setValue(this.contentTypes![0].id);
    });
  }

  identifyContentType(index: number, item: ContentType) {
    return item.id;
  }

  // create section

  @Output() createEvent: EventEmitter<Comment> = new EventEmitter();
  onCreateButton(): void {
    var userId = this.authService.getUserId();

    var comment = new Content({
      user_id: userId!,
      content_type_id: this.commentForm.get('contentType')?.value,
      content_text: this.commentForm.get('contentText')?.value,
    });

    this.commentService
      .createComment(this.route.snapshot.params['threadId'], comment)
      .subscribe((success) => {
        this.commentForm.reset();
        this.commentForm.get('contentType')?.setValue(this.contentTypes![0].id);
        this.commentService
          .getOneComment(success.id)
          .subscribe((comment) => this.createEvent.emit(comment));
      });
  }

  // read section

  onUpdateButton(): void {
    this.state = State.Update;
    this.commentForm
      .get('contentType')
      ?.setValue(this.commentData.content_type_id);
    this.commentForm
      .get('contentText')
      ?.setValue(this.commentData.content_text);
  }

  @Output() deleteEvent: EventEmitter<Comment> = new EventEmitter();
  onDeleteButton(): void {
    if (confirm('Êtes-vous sûr(e) de vouloir supprimer ce commentaire ?')) {
      this.commentService
        .deleteComment(this.commentData.thread_id!, this.commentData.id!)
        .subscribe((success) => {
          this.deleteEvent.emit(this.commentData);
        });
    }
  }

  onModerateButton(): void {
    if (confirm('Êtes-vous sûr(e) de vouloir modérer ce commentaire ?')) {
      this.commentService
        .moderateComment(this.commentData.thread_id, this.commentData.id!)
        .subscribe((success) => {
          this.deleteEvent.emit(this.commentData);
        });
    }
  }

  isOwner(): boolean {
    return this.authService.getUserId() == this.commentData.user_id;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // update section

  cancelUpdate() {
    this.state = State.Read;
  }

  update(): void {
    var comment = new Content({
      content_type_id: this.commentForm.get('contentType')?.value,
      content_text: this.commentForm.get('contentText')?.value,
    });

    this.commentService
      .updateComment(this.commentData.id, this.commentData.thread_id, comment)
      .subscribe((success) => {
        this.commentService
          .getOneComment(this.commentData.id)
          .subscribe((comment) => {
            this.commentData = comment;
            this.state = State.Read;
          });
      });
  }

  // like section

  getCommentLikes() {
    if (!this.commentData) return;
    this.likeService
      .getCommentLikes(this.commentData.thread_id!, this.commentData.id!)
      .subscribe((res) => {
        this.likes = res;
      });
  }

  getUserLikesComment() {
    var userId = this.authService.getUserId();
    this.likeService
      .getUserLikesOnComment(
        this.commentData.thread_id!,
        this.commentData.id!,
        userId!
      )
      .subscribe((res) => {
        this.userLikes = res;
      });
  }

  like(): void {
    this.likeService
      .likeComment(this.commentData.thread_id!, this.commentData.id!, 1)
      .subscribe((success) => {
        this.getUserLikesComment();
        this.getCommentLikes();
      });
  }

  dislike(): void {
    this.likeService
      .likeComment(this.commentData.thread_id!, this.commentData.id!, -1)
      .subscribe((success) => {
        this.getUserLikesComment();
        this.getCommentLikes();
      });
  }

  unlike(): void {
    this.likeService
      .likeComment(this.commentData.thread_id!, this.commentData.id!, 0)
      .subscribe((success) => {
        this.getUserLikesComment();
        this.getCommentLikes();
      });
  }
}
