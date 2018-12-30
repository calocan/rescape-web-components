/**
 * Created by Andy Likuski on 2018.01.17
 * Copyright (c) 2018 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {getCurrentConfig, privateConfig, createSchema, createInitialState} from 'rescape-sample-data';
import {createSelectorResolvedSchema} from 'rescape-apollo';
import {of} from 'folktale/concurrency/task';
import PropTypes from 'prop-types';
import {v} from 'rescape-validate';
import {makeSampleInitialState, makeApolloTestPropsTaskFunction, propsFromParentPropsTask} from 'rescape-helpers-test'


/**
 *
 * These helpers are trivial functions that use rescape-sample-data and rescape-helpers-component togther,
 * creating functions that are seeded with sample data for testing
 */
export const currentConfig = getCurrentConfig(privateConfig);

/**
 * Sample initial state for tests
 */
export const sampleInitialState = makeSampleInitialState(createInitialState, currentConfig);

/**
 * Resolved schema for tests
 * @type {Object}
 */
export const resolvedSchema = createSelectorResolvedSchema(createSchema(), currentConfig);

/**
 * Calls makenApolloTestPropsFunction with the given * 3 arguments:
 * mapStateToProps, mapDispatchToProps, {query, args}
 * See makeApolloTestPropsFunction for details.
 * The resulting promise is wrapped in a Task.
 * @param {Function} mapStateToProps
 * @param {Function} mapDispatchToProps
 * @param {Object} queryInfo
 * @returns {Function} A 2 arity function called with state and props that results in a Task that
 * resolves the props as A Right if no errors and a Left if errors
 */
export const apolloTestPropsTaskMaker = v((mapStateToProps, mapDispatchToProps, queryInfo) =>
    (state, props) => makeApolloTestPropsTaskFunction(
      resolvedSchema,
      currentConfig,
      mapStateToProps,
      mapDispatchToProps,
      queryInfo
    )(state, props)
  , [
    ['mapStateToProps', PropTypes.func.isRequired],
    ['mapDispatchToProps', PropTypes.func.isRequired],
    ['queryInfo', PropTypes.shape().isRequired]
  ], 'apolloTestPropsTaskMaker');


/**
 * Given a Task to fetch parent container props and a task to fetch the current container props,
 * Fetches the parent props and then samplePropsTaskMaker with the initial state and parent props
 * @param {Task} parentContainerSamplePropsTask Task that resolves to the parent container props
 * @param {Function} samplePropsTaskMaker 2 arity function expecting state and parent props.
 * Returns a Task from a container that expects a sample state and sampleOwnProps
 * and then applies the container's mapStateToProps, mapDispatchToProps, and optional mergeProps
 * @param parentComponentViews A function expecting props that returns an object keyed by view names
 * and valued by view props, where views are the child containers/components of the component
 * @param viewName The viewName in the parent component of the target container
 * @returns {Task} A Task to asynchronously return the parentContainer props merged with sampleOwnProps
 * in an Result.Ok. If anything goes wrong an Result.Error is returned
 */
export const localPropsFromParentPropsHelperTask = v((chainedParentPropsTask, samplePropsTaskMaker) =>
  propsFromParentPropsTask(sampleInitialState, chainedParentPropsTask, samplePropsTaskMaker),
  [
    ['chainedParentPropsTask', PropTypes.shape().isRequired],
    ['samplePropsTaskMaker', PropTypes.func.isRequired]
  ],
  'localPropsFromParentPropsHelperTask');

