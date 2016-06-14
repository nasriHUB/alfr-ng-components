/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {Observable} from 'rxjs/Rx';

import {
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoContentService
} from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import {AlfrescoService} from './../../src/services/alfresco.service';

export class AlfrescoServiceMock extends AlfrescoService {

    _folderToReturn: any = {};

    constructor(
        settings: AlfrescoSettingsService = null,
        authService: AlfrescoAuthenticationService = null,
        contentService: AlfrescoContentService = null
    ) {
        super(settings, authService, contentService);
    }

    getFolder(folder: string) {
        return Observable.create(observer => {
            observer.next(this._folderToReturn);
            observer.complete();
        });
    }
}
