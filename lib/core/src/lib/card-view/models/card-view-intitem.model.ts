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

import { CardViewItem } from '../interfaces/card-view-item.interface';
import { DynamicComponentModel } from '../../common/services/dynamic-component-mapper.service';
import { CardViewTextItemModel } from './card-view-textitem.model';
import { CardViewTextItemProperties } from '../interfaces/card-view.interfaces';
import { CardViewItemIntValidator } from '../validators/card-view.validators';

export class CardViewIntItemModel extends CardViewTextItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'int';
    inputType: string = 'number';

    constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
        super(cardViewTextItemProperties);

        this.validators.push(new CardViewItemIntValidator());
        if (cardViewTextItemProperties.value && !cardViewTextItemProperties.multivalued) {
            this.value = parseInt(cardViewTextItemProperties.value, 10);
        }
    }

    get displayValue(): string {
        return this.applyPipes(this.value);
    }
}
