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

import { TestBed } from '@angular/core/testing';
import {
    ContainerModel,
    FormFieldModel,
    FormFieldTypes,
    FormModel,
    TabModel
} from '../components/widgets/core';
import { WidgetVisibilityModel } from '../models/widget-visibility.model';
import { WidgetVisibilityService } from './widget-visibility.service';
import { setupTestBed } from '../../testing/setup-test-bed';
import {
    fakeFormJson, formTest,
    formValues, complexVisibilityJsonVisible,
    complexVisibilityJsonNotVisible, tabVisibilityJsonMock,
    tabInvalidFormVisibility,
    fakeFormChainedVisibilityJson,
    fakeFormCheckBoxVisibilityJson
} from '../../mock/form/widget-visibility.service.mock';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('WidgetVisibilityService', () => {

    let service: WidgetVisibilityService;
    let booleanResult: boolean;
    const stubFormWithFields = new FormModel(fakeFormJson);

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(WidgetVisibilityService);
    });

    describe('should be able to evaluate next condition operations', () => {

        it('using == and return true', () => {
            booleanResult = service.evaluateCondition('test', 'test', '==');
            expect(booleanResult).toBeTruthy();
        });

        it('using < and return true', () => {
            booleanResult = service.evaluateCondition(1, 2, '<');
            expect(booleanResult).toBeTruthy();
        });

        it('using != and return true', () => {
            booleanResult = service.evaluateCondition(true, false, '!=');
            expect(booleanResult).toBeTruthy();
        });

        it('using != and return false', () => {
            booleanResult = service.evaluateCondition(true, true, '!=');
            expect(booleanResult).toBeFalsy();
        });

        it('using >= and return true', () => {
            booleanResult = service.evaluateCondition(2, 2, '>=');
            expect(booleanResult).toBeTruthy();
        });

        it('using empty with null values and return true', () => {
            booleanResult = service.evaluateCondition(null, null, 'empty');
            expect(booleanResult).toBeTruthy();
        });

        it('using empty with empty strings values and return true', () => {
            booleanResult = service.evaluateCondition('', '', 'empty');
            expect(booleanResult).toBeTruthy();
        });

        it('using empty with empty string value and return false', () => {
            booleanResult = service.evaluateCondition('fake_value', undefined, 'empty');
            expect(booleanResult).toBeFalsy();
        });

        it('using > and return false', () => {
            booleanResult = service.evaluateCondition(2, 3, '>');
            expect(booleanResult).toBeFalsy();
        });

        it('using not empty with null values and return false', () => {
            booleanResult = service.evaluateCondition(null, null, '!empty');
            expect(booleanResult).toBeFalsy();
        });

        it('using OR NOT with empty strings and return false', () => {
            booleanResult = service.evaluateCondition('', '', '!empty');
            expect(booleanResult).toBeFalsy();
        });

        it('using <= and return false', () => {
            booleanResult = service.evaluateCondition(2, 1, '<=');
            expect(booleanResult).toBeFalsy();
        });

        it('using <= and return true for different values', () => {
            booleanResult = service.evaluateCondition(1, 2, '<=');
            expect(booleanResult).toBeTruthy();
        });

        it('using <= and return true for same values', () => {
            booleanResult = service.evaluateCondition(2, 2, '<=');
            expect(booleanResult).toBeTruthy();
        });

        it('should return undefined for invalid operation', () => {
            booleanResult = service.evaluateCondition(null, null, undefined);
            expect(booleanResult).toBeUndefined();
        });

        it('should return true when element contains', () => {
            booleanResult = service.evaluateCondition(['one', 'two'], ['one'], 'contains');
            expect(booleanResult).toBe(true);
        });

        it('should return false when element not contains', () => {
            booleanResult = service.evaluateCondition(['two'], ['one'], 'contains');
            expect(booleanResult).toBe(false);
        });

        it('should return true when element not contains', () => {
            booleanResult = service.evaluateCondition(['two'], ['one'], '!contains');
            expect(booleanResult).toBe(true);
        });

        it('should return false when element contains', () => {
            booleanResult = service.evaluateCondition(['one', 'two'], ['one'], '!contains');
            expect(booleanResult).toBe(false);
        });
    });

    describe('should return the value of the field', () => {
        let visibilityObjTest: WidgetVisibilityModel;
        let fakeFormWithField: FormModel;

        const jsonFieldFake = {
            id: 'FAKE_FORM_FIELD_ID',
            value: 'FAKE_FORM_FIELD_VALUE',
            visibilityCondition: undefined
        };
        const fakeForm = new FormModel({
            variables: [
                {
                    name: 'FORM_VARIABLE_TEST',
                    type: 'string',
                    value: 'form_value_test'
                }]
        });

        beforeEach(() => {
            fakeFormWithField = new FormModel(fakeFormJson);
            visibilityObjTest = new WidgetVisibilityModel();
            fakeFormWithField = new FormModel(fakeFormJson);
            formTest.values = formValues;
            jsonFieldFake.visibilityCondition = visibilityObjTest;
        });

        afterEach(() => {
            service.cleanProcessVariable();
        });

        it('should be able to retrieve a field value searching in the form', () => {
            const formField = service.getFormFieldById(stubFormWithFields, 'FIELD_WITH_CONDITION');
            const formValue = service.searchValueInForm(formField, 'FIELD_WITH_CONDITION');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('field_with_condition_value');
        });

        it('should return empty string if the field value is not in the form', () => {
            const formField = service.getFormFieldById(stubFormWithFields, 'FIELD_MYSTERY');
            const formValue = service.searchValueInForm(formField, 'FIELD_MYSTERY');

            expect(formValue).not.toBeUndefined();
            expect(formValue).toBe('');
        });

        it('should search in the form if element value is not in form values', () => {
            const value = service.getFormValue(fakeFormWithField, 'FIELD_WITH_CONDITION');

            expect(value).not.toBeNull();
            expect(value).toBe('field_with_condition_value');
        });

        it('should return empty string if the element is not present anywhere', () => {
            const formValue = service.getFormValue(fakeFormWithField, 'FIELD_MYSTERY');
            expect(formValue).toBeUndefined();
        });

        it('should retrieve the value for the right field when it is a value', () => {
            visibilityObjTest.rightValue = '100';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('100');
        });

        it('should return formatted date when right value is a date', () => {
            visibilityObjTest.rightValue = '9999-12-31';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('9999-12-31T00:00:00.000Z');
        });

        it('should return the value when right value is not a date', () => {
            visibilityObjTest.rightValue = '9999-99-99';
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBe('9999-99-99');
        });

        it('should retrieve the value for the right field when it is a form variable', () => {
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            const rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);

            expect(rightValue).not.toBeNull();
            expect(rightValue).toBe('RIGHT_FORM_FIELD_VALUE');
        });

        it('should take the value from form values if it is present', () => {
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const formValue = service.getFormValue(formTest, 'test_1');

            expect(formValue).not.toBeNull();
            expect(formValue).toBe('value_1');
        });

        it('should retrieve right value from form values if it is present', () => {
            visibilityObjTest.rightFormFieldId = 'test_2';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).not.toBeNull();
            expect(formTest.values).toEqual(formValues);
            expect(rightValue).toBe('value_2');
        });

        it('should retrieve the value for the left field when it is a form value', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_WITH_CONDITION';
            const leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('field_with_condition_value');
        });

        it('should retrieve left value from form values if it is present', () => {
            visibilityObjTest.leftFormFieldId = 'test_2';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const leftValue = service.getLeftValue(formTest, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('value_2');
        });

        it('should return empty string for a value that is not on variable or form', () => {
            const leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);

            expect(leftValue).toBe('');
        });

        it('should evaluate the visibility for the field with single visibility condition between two field values', () => {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'test_3';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const isVisible = service.isFieldVisible(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should evaluate true visibility for the field with single visibility condition between a field and a value', () => {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'value_1';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const isVisible = service.isFieldVisible(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should undefined string for a value that is not on variable or form', () => {
            visibilityObjTest.rightFormFieldId = 'NO_FIELD_FORM';
            const rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);

            expect(rightValue).toBeUndefined();
        });

        it('should evaluate the visibility for the field with single visibility condition between form values', () => {
            visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            const isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should refresh the visibility for a form field object', () => {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'test_3';
            const fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeFalsy();
        });

        it('should return true when the visibility condition is not valid', () => {
            visibilityObjTest.leftFormFieldId = '';
            visibilityObjTest.leftRestResponseId = '';
            visibilityObjTest.operator = '!=';
            const isVisible = service.evaluateVisibility(formTest, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should return always true when field does not have a visibility condition', () => {
            jsonFieldFake.visibilityCondition = null;
            const fakeFormField: FormFieldModel = new FormFieldModel(fakeFormWithField, jsonFieldFake);
            fakeFormField.isVisible = false;
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to retrieve the value of a form variable', () => {
            const varValue = service.getVariableValue(fakeForm, 'FORM_VARIABLE_TEST', null);

            expect(varValue).not.toBeUndefined();
            expect(varValue).toBe('form_value_test');
        });

        it('should return undefined for not existing form variable', () => {
            const varValue = service.getVariableValue(fakeForm, 'MYSTERY_FORM_VARIABLE', null);

            expect(varValue).toBeUndefined();
        });

        it('should retrieve the value for the left field when it is a form variable', () => {
            visibilityObjTest.leftRestResponseId = 'FORM_VARIABLE_TEST';
            const leftValue = service.getLeftValue(fakeForm, visibilityObjTest);

            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('form_value_test');
        });

        it('should determine visibility for dropdown on label condition', () => {
            const dropdownValue = service.getFieldValue(formTest.values, 'dropdown_LABEL');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });

        it('should be able to get the value for a dropdown filtered with Label', () => {
            const dropdownValue = service.getFieldValue(formTest.values, 'dropdown_LABEL');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });

        it('should be able to get the value for a standard field', () => {
            const dropdownValue = service.getFieldValue(formTest.values, 'test_2');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('value_2');
        });

        it('should get the dropdown label value from a form', () => {
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const dropdownValue = service.getFormValue(formTest, 'dropdown_LABEL');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });

        it('should get the dropdown id value from a form', () => {
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const dropdownValue = service.getFormValue(formTest, 'dropdown');

            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_id');
        });

        it('should retrieve the value for the right field when it is a dropdown id', () => {
            visibilityObjTest.rightFormFieldId = 'dropdown';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBeDefined();
            expect(rightValue).toBe('dropdown_id');
        });

        it('should retrieve the value for the right field when it is a dropdown label', () => {
            visibilityObjTest.rightFormFieldId = 'dropdown_LABEL';
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const rightValue = service.getRightValue(formTest, visibilityObjTest);

            expect(rightValue).toBeDefined();
            expect(rightValue).toBe('dropdown_label');
        });

        it('should be able to evaluate condition with a dropdown <label>', () => {
            visibilityObjTest.leftFormFieldId = 'test_5';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'dropdown_LABEL';
            const fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to evaluate condition with a dropdown <id>', () => {
            visibilityObjTest.leftFormFieldId = 'test_4';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'dropdown';
            const fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);

            expect(fakeFormField.isVisible).toBeTruthy();
        });

        it('should be able to get value from form values', () => {
            spyOn(service, 'isFormFieldValid').and.returnValue(true);
            const res = service.getFormValue(formTest, 'test_1');

            expect(res).not.toBeNull();
            expect(res).toBeDefined();
            expect(res).toBe('value_1');
        });

        it('should refresh the visibility for field', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';

            const container = fakeFormWithField.fields[0];
            const column0 = container.field.columns[0];
            const column1 = container.field.columns[1];

            column0.fields[0].visibilityCondition = visibilityObjTest;
            service.refreshVisibility(fakeFormWithField);

            expect(column0.fields[0].isVisible).toBeFalsy();
            expect(column0.fields[1].isVisible).toBeTruthy();
            expect(column0.fields[2].isVisible).toBeTruthy();
            expect(column1.fields[0].isVisible).toBeTruthy();
        });

        it('should refresh the visibility for tab in forms', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            const tab = new TabModel(fakeFormWithField, {
                id: 'fake-tab-id',
                title: 'fake-tab-title',
                isVisible: true
            });
            tab.visibilityCondition = visibilityObjTest;
            fakeFormWithField.tabs.push(tab);
            service.refreshVisibility(fakeFormWithField);
            expect(fakeFormWithField.tabs[0].isVisible).toBeFalsy();
        });

        it('should refresh the visibility for single tab', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            const tab = new TabModel(fakeFormWithField, {
                id: 'fake-tab-id',
                title: 'fake-tab-title',
                isVisible: true
            });
            tab.visibilityCondition = visibilityObjTest;
            service.refreshEntityVisibility(tab);

            expect(tab.isVisible).toBeFalsy();
        });

        it('should refresh the visibility for container in forms', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'LEFT_FORM_FIELD_ID';
            const contModel = new ContainerModel(new FormFieldModel(fakeFormWithField, {
                id: 'fake-container-id',
                type: FormFieldTypes.GROUP,
                name: 'fake-container-name',
                isVisible: true,
                visibilityCondition: visibilityObjTest
            }));

            fakeFormWithField.fieldsCache.push(contModel.field);
            service.refreshVisibility(fakeFormWithField);
            expect(contModel.isVisible).toBeFalsy();
        });

        it('should refresh the visibility for single container', () => {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            const contModel = new ContainerModel(new FormFieldModel(fakeFormWithField, {
                id: 'fake-container-id',
                type: FormFieldTypes.GROUP,
                name: 'fake-container-name',
                isVisible: true,
                visibilityCondition: visibilityObjTest
            }));
            service.refreshEntityVisibility(contModel.field);
            expect(contModel.isVisible).toBeFalsy();
        });

        it('should not set null value when the field is not visibile', () => {
            visibilityObjTest.leftFormFieldId = 'test_4';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'dropdown';
            const fakeFormField: FormFieldModel = new FormFieldModel(formTest, jsonFieldFake);

            service.refreshEntityVisibility(fakeFormField);
            expect(fakeFormField.isVisible).toBeFalsy();
            expect(fakeFormField.value).toEqual('FAKE_FORM_FIELD_VALUE');
        });

        it('should evaluate radio box LABEL condition', (done) => {
            visibilityObjTest.leftFormFieldId = 'radioBoxField_LABEL';
            visibilityObjTest.leftRestResponseId = null;
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'No';
            visibilityObjTest.rightType = null;
            visibilityObjTest.rightFormFieldId = '';
            visibilityObjTest.rightRestResponseId = '';
            visibilityObjTest.nextConditionOperator = '';
            visibilityObjTest.nextCondition = null;

            const radioBoxForm = new FormModel({
                id: '9999',
                name: 'CHECKBOX_VISIBILITY',
                processDefinitionId: 'PROCESS_TEST:9:9999',
                processDefinitionName: 'PROCESS_TEST',
                processDefinitionKey: 'PROCESS_TEST',
                taskId: '999',
                taskName: 'TEST',
                fields: [
                    {
                        fieldType: 'ContainerRepresentation',
                        id: '000000000000000000',
                        name: 'Label',
                        type: 'container',
                        value: null,
                        numberOfColumns: 2,
                        fields: {
                            1: [
                                {
                                    id: 'radioboxField',
                                    name: 'radioboxField test',
                                    type: 'radio-buttons',
                                    options: [
                                        {
                                            id: 'radioBoxYes',
                                            name: 'Yes'
                                        },
                                        {
                                            id: 'radioBoxNo',
                                            name: 'No'
                                        }
                                    ]
                                }, {
                                    id: 'textBoxTest',
                                    name: 'textbox test',
                                    type: 'people',
                                    visibilityCondition: visibilityObjTest
                                }
                            ]
                        }
                    }
                ]
            });

            const fieldWithVisibilityAttached = radioBoxForm.getFieldById('textBoxTest');
            const radioBox = radioBoxForm.getFieldById('radioboxField');

            radioBox.value = 'Yes';
            service.refreshVisibility(radioBoxForm);
            expect(fieldWithVisibilityAttached.isVisible).toBeFalsy();

            radioBox.value = 'No';
            service.refreshVisibility(radioBoxForm);
            expect(fieldWithVisibilityAttached.isVisible).toBeTruthy();

            done();
        });
    });

    describe('Visibility based on form variables', () => {

        let fakeFormWithVariables = new FormModel(fakeFormJson);
        const fakeTabVisibilityModel = new FormModel(tabVisibilityJsonMock);
        const complexVisibilityModel = new FormModel(complexVisibilityJsonVisible);
        const complexVisibilityJsonNotVisibleModel = new FormModel(complexVisibilityJsonNotVisible);
        let invalidTabVisibilityJsonModel: FormModel;
        let visibilityObjTest: WidgetVisibilityModel;

        beforeEach(() => {
            visibilityObjTest = new WidgetVisibilityModel();
            invalidTabVisibilityJsonModel = new FormModel(tabInvalidFormVisibility);
            fakeFormWithVariables = new FormModel(fakeFormJson);
        });

        it('should set visibility to true when validation for string variables succeeds', () => {
            visibilityObjTest.leftRestResponseId = 'name';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'abc';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should be able to analyze a complex visibility JSON truthy', () => {
            const isVisible = service.isFieldVisible(complexVisibilityModel,
                complexVisibilityJsonVisible.formDefinition.fields[2].fields[2][0].visibilityCondition);

            expect(isVisible).toBe(true);
        });

        it('should be able to analyze a complex visibility JSON false', () => {
            const formField = new FormFieldModel(complexVisibilityJsonNotVisibleModel, complexVisibilityJsonNotVisible.formDefinition.fields[2].fields[2][0]);
            const isVisible = service.isFieldVisible(complexVisibilityJsonNotVisibleModel, new WidgetVisibilityModel(formField.visibilityCondition));
            expect(isVisible).toBe(false);
        });

        it('should set visibility to false when validation for string variables fails', () => {
            visibilityObjTest.leftRestResponseId = 'name';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'abc1';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeFalsy();
        });

        it('should set visibility to true when validation for integer variables succeeds', () => {
            visibilityObjTest.leftRestResponseId = 'age';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '11';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should set visibility to false when validation for integer variables fails', () => {
            visibilityObjTest.leftRestResponseId = 'age';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '13';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeFalsy();
        });

        it('should set visibility to true when validation for date variables succeeds', () => {
            visibilityObjTest.leftRestResponseId = 'dob';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '2019-05-13T00:00:00.000Z';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should set visibility to false when validation for date variables fails', () => {
            visibilityObjTest.leftRestResponseId = 'dob';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '2019-05-15T00:00:00.000Z';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeFalsy();
        });

        it('should validate visiblity for form fields by finding the field with id', () => {
            visibilityObjTest.leftRestResponseId = '0207b649-ff07-4f3a-a589-d10afa507b9b';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = '2019-05-13T00:00:00.000Z';
            const isVisible = service.isFieldVisible(fakeFormWithVariables, visibilityObjTest);

            expect(isVisible).toBeTruthy();
        });

        it('should validate visiblity for multiple tabs', () => {
            visibilityObjTest.leftFormFieldId = 'label';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'text';

            service.refreshVisibility(fakeTabVisibilityModel);
            expect(fakeTabVisibilityModel.tabs[1].isVisible).toBeFalsy();

            fakeTabVisibilityModel.getFieldById('label').value = 'text';
            service.refreshVisibility(fakeTabVisibilityModel);
            expect(fakeTabVisibilityModel.tabs[1].isVisible).toBeTruthy();
        });

        it('form should be valid when a tab with invalid values is not visibile', () => {
            invalidTabVisibilityJsonModel.getFieldById('Number1').value = 'invalidField';
            invalidTabVisibilityJsonModel.getFieldById('Text1').value = 'showtab';

            service.refreshVisibility(invalidTabVisibilityJsonModel);
            invalidTabVisibilityJsonModel.validateForm();
            expect(invalidTabVisibilityJsonModel.isValid).toBeFalsy();

            invalidTabVisibilityJsonModel.getFieldById('Text1').value = 'hidetab';
            service.refreshVisibility(invalidTabVisibilityJsonModel);
            invalidTabVisibilityJsonModel.validateForm();
            expect(invalidTabVisibilityJsonModel.isValid).toBeTruthy();
        });
    });

    describe('Visibility calculation in complex forms', () => {

        const fakeFormWithVariables = new FormModel(fakeFormChainedVisibilityJson);

        it('Should be able to validate correctly the visibility for the text field for complex expressions', () => {
            const instalmentField = fakeFormWithVariables.getFieldById('installments');
            const scheduleField = fakeFormWithVariables.getFieldById('schedule');

            instalmentField.value = '6';
            scheduleField.value = scheduleField.options[1].id;

            service.refreshVisibility(fakeFormWithVariables);

            let textField = fakeFormWithVariables.getFieldById('showtext');

            expect(textField.isVisible).toBe(true);

            instalmentField.value = '5';
            scheduleField.value = scheduleField.options[1].id;

            service.refreshVisibility(fakeFormWithVariables);

            textField = fakeFormWithVariables.getFieldById('showtext');

            expect(textField.isVisible).toBe(false);
        });
    });

    describe('Visibility calculation in checkbox forms', () => {

        const fakeFormWithValues = new FormModel(fakeFormCheckBoxVisibilityJson);

        it('Should be able to validate correctly the visibility for the checkbox expression', () => {
            const fieldA = fakeFormWithValues.getFieldById('a');
            const fieldB = fakeFormWithValues.getFieldById('b');
            const fieldC = fakeFormWithValues.getFieldById('c');
            const fieldD = fakeFormWithValues.getFieldById('d');
            fieldA.value = true;
            fieldB.value = true;
            fieldC.value = false;
            fieldD.value = false;

            service.refreshVisibility(fakeFormWithValues);
            const textField = fakeFormWithValues.getFieldById('a_b_c_d');

            expect(textField.isVisible).toBe(true);

            fieldB.value = false;

            service.refreshVisibility(fakeFormWithValues);
            expect(textField.isVisible).toBe(false);

            fieldA.value = false;
            fieldC.value = true;
            fieldD.value = true;

            service.refreshVisibility(fakeFormWithValues);
            expect(textField.isVisible).toBe(true);
        });
    });
});
