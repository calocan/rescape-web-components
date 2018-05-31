/**
 * Created by Andy Likuski on 2018.03.07
 * Copyright (c) 2018 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {apolloTestPropsTaskMaker, sampleParentPropsTask} from 'helpers/helpers';
import {mapStateToProps, mapDispatchToProps, queries} from './AppContainer';
import {chainedSamplePropsTask as parentContainerSamplePropsTask} from 'components/app/AppContainer.sample';
import Parent, {c as parentC} from 'components/app/App';
import {of} from 'folktale/concurrency/task';
import Either from 'data.either'

/**
 * @file Links sample props from a Current component to a Region component
 */

/**
 * Returns a function that expects state and parentProps for testing and returns a Task that resolves the props
 */
export const samplePropsTaskMaker = apolloTestPropsTaskMaker(mapStateToProps, mapDispatchToProps, queries.userRegions);

/**
 * Since there is no parent, just supply {} for the parent and
 */
export const chainedSamplePropsTask = sampleParentPropsTask(
  of(Either.Right({})),
  samplePropsTaskMaker,
  props => ({generic: props.data}),
  'generic'
);
