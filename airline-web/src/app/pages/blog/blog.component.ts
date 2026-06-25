import { DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SITE } from '../../core/site.constants';
import { BLOG_CATEGORIES, BLOG_POSTS } from './blog.content';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  readonly site = SITE;
  readonly categories = BLOG_CATEGORIES;
  readonly activeCategory = signal<string>('All');

  readonly filteredPosts = computed(() => {
    const category = this.activeCategory();
    if (category === 'All') {
      return BLOG_POSTS;
    }
    return BLOG_POSTS.filter((post) => post.category === category);
  });

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }
}
