/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Pagination, ResultSetPaging } from '@alfresco/js-api';
import { SearchConfiguration, SearchForm, SearchQueryBuilderService, SearchService } from '@alfresco/adf-content-services';
import { ShowHeaderMode, UserPreferencesService } from '@alfresco/adf-core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-search-filter-chips',
    templateUrl: './search-filter-chips.component.html',
    styleUrls: [ './search-filter-chips.component.scss' ],
    providers: [SearchService]
})
export class SearchFilterChipsComponent implements OnInit, OnDestroy {

    queryParamName = 'q';
    searchedWord = '';
    data: ResultSetPaging;
    pagination: Pagination;
    isLoading = true;

    sorting = ['name', 'asc'];
    searchForms: SearchForm[];
    showHeader = ShowHeaderMode.Always;

    private onDestroy$ = new Subject<boolean>();

    constructor(public router: Router,
                private preferences: UserPreferencesService,
                private queryBuilder: SearchQueryBuilderService,
                private route: ActivatedRoute) {
        combineLatest([this.route.params, this.queryBuilder.configUpdated])
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(([params, searchConfig]) => {
                this.updateSearchSetting(searchConfig);
                this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                const query = this.formatSearchQuery(this.searchedWord, searchConfig['app:fields']);
                if (query) {
                    this.queryBuilder.userQuery = query;
                }
        });

        queryBuilder.paging = {
            maxItems: this.preferences.paginationSize,
            skipCount: 0
        };
    }

    ngOnInit() {
        this.queryBuilder.resetToDefaults();

        this.sorting = this.getSorting();

        this.queryBuilder.updated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.sorting = this.getSorting();
                this.isLoading = true;
            });

        this.queryBuilder.executed
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((resultSetPaging: ResultSetPaging) => {
                this.queryBuilder.paging.skipCount = 0;

                this.onSearchResultLoaded(resultSetPaging);
                this.isLoading = false;
            });

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                if (this.searchedWord) {
                    this.queryBuilder.update();
                } else {
                    this.queryBuilder.userQuery = null;
                    this.queryBuilder.executed.next(new ResultSetPaging({
                        list: {
                            pagination: { totalItems: 0 },
                            entries: []
                        }
                    }));
                }
            });
        }
    }

    private formatSearchQuery(userInput: string, fields =  ['cm:name']) {
        if (!userInput) {
            return null;
        }
        return fields.map((field) => `${field}:"${userInput}*"`).join(' OR ');
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onSearchResultLoaded(resultSetPaging: ResultSetPaging) {
        this.data = resultSetPaging;
        this.pagination = { ...resultSetPaging.list.pagination };
    }

    onRefreshPagination(pagination: Pagination) {
        this.queryBuilder.paging = {
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };
        this.queryBuilder.update();
    }

    onDeleteElementSuccess() {
        this.queryBuilder.execute();
    }

    private getSorting(): string[] {
        const primary = this.queryBuilder.getPrimarySorting();

        if (primary) {
            return [primary.key, primary.ascending ? 'asc' : 'desc'];
        }

        return ['name', 'asc'];
    }

    private updateSearchSetting(config: SearchConfiguration): void {
        if (config.facetQueries) {
            this.updateSetting(config.facetQueries);
        }

        if (config.facetFields?.fields?.length) {
            config.facetFields.fields.forEach((field) => this.updateSetting(field));
        }

        if (config.facetIntervals?.intervals?.length) {
            config.facetIntervals.intervals.forEach((field) => this.updateSetting(field));
        }

        if (config.categories.length) {
            config.categories.forEach((field) => this.updateSetting(field.component));
        }
    }

    private updateSetting(field) {
        field.settings = field.settings ?? {};
        field.settings.allowUpdateOnChange = false;
        field.settings.hideDefaultAction = true;
    }
}
