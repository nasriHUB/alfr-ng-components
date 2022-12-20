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

import { CommentModel, EcmCompanyModel, EcmUserModel } from '../../models';

const fakeCompany: EcmCompanyModel = {
    organization: '',
    address1: '',
    address2: '',
    address3: '',
    postcode: '',
    telephone: '',
    fax: '',
    email: ''
};

export const getDateXMinutesAgo = (minutes: number) => new Date(new Date().getTime() - minutes * 60000);

const johnDoe: EcmUserModel = {
    id: '1',
    email: 'john.doe@alfresco.com',
    firstName: 'John',
    lastName: 'Doe',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined,
    avatarId: '001'
};

const janeEod: EcmUserModel = {
    id: '2',
    email: 'jane.eod@alfresco.com',
    firstName: 'Jane',
    lastName: 'Eod',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined
};

const robertSmith: EcmUserModel = {
    id: '3',
    email: 'robert.smith@alfresco.com',
    firstName: 'Robert',
    lastName: 'Smith',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined
};

export const testUser: EcmUserModel = {
    id: '44',
    email: 'test.user@hyland.com',
    firstName: 'Test',
    lastName: 'User',
    company: fakeCompany,
    enabled: true,
    isAdmin: undefined,
    avatarId: '044'
};


export const commentsStoriesData: CommentModel[] = [
    {
      id: 1,
      message: `I've done this task, what's next?`,
      created: getDateXMinutesAgo(30),
      createdBy: johnDoe,
      isSelected: false
    },
    {
      id: 2,
      message: `I've assigned you another one 🤠`,
      created: getDateXMinutesAgo(15),
      createdBy: janeEod,
      isSelected: false
    },
    {
      id: 3,
      message: '+1',
      created: getDateXMinutesAgo(12),
      createdBy: robertSmith,
      isSelected: false
    },
    {
      id: 4,
      message: 'Cheers',
      created: new Date(),
      createdBy: johnDoe,
      isSelected: false
    }
];
