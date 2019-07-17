/* tslint:disable:next-line: indent */
import { NewsApiService } from '../services/news-feed.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Interface for Data coming from Service
export interface DialogData {
	author: string;
	content: string;
	description: string;
	publishedAt: string;
	source: Source;
	title: string;
	url: string;
	urlToImage: string;
}
export interface Source {
	id: string;
	name: string;
}
@Component({
	selector: 'app-news-feed',
	templateUrl: './news-feed.component.html',
	styleUrls: ['./news-feed.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NewsFeedComponent implements OnDestroy, OnInit {
	mobileQuery: MediaQueryList;
	mArticles: Array<any>;
	mSources: Array<any>;
	unfilteredArticles: Array<any>;

	private _mobileQueryListener: () => void;

	constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private newsapi: NewsApiService, public dialog: MatDialog) {

		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}
	ngOnInit() {
		// Load news sources
		this.newsapi.initSources().subscribe(data => (this.mSources = data['articles'],
			this.mArticles = this.mSources,
			this.unfilteredArticles = this.mArticles,
			this.mSources = removeduplicateEntries(this.mSources)
		));
		// Prepare Data to give into Filter, Checks and removes Sources for Duplicate ids so that Filter Does not have Duplicate Entries
		const obj = {};
		function removeduplicateEntries(articles) {
			for (let i = 0, len = articles.length; i < len; i++) {
				obj[articles[i]['source']['id']] = articles[i];
			}
			articles = new Array();
			// tslint:disable-next-line: forin
			for (const key in obj) {
				articles.push(obj[key]);
			}
			return articles;
		}

	}
	// Reset Filter
	resetFilter() {
		this.mArticles = this.unfilteredArticles;
	}
	// Filter article by ID
	filterArticles(source) {
		this.newsapi.getArticlesByID(source).subscribe(data => (this.mArticles = data['articles']));
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}
	// Open Modal to Expand News
	openDialog(data: DialogData): void {
		const dialogRef = this.dialog.open(DialogOverviewModal, {
			data: data,
		});

	}

}
// Component for Modal
@Component({
	selector: 'dialog-overview-modal',
	templateUrl: 'dialog-overview-modal.html',
})
export class DialogOverviewModal {

	constructor(
		public dialogRef: MatDialogRef<DialogOverviewModal>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
	// Closing Modal
	onNoClick(): void {
		this.dialogRef.close();
	}

}




