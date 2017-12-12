/**
 * Created by Andy Likuski on 2017.06.06
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import {taskToPromise, mergeDeep} from 'rescape-ramda';
import {sampleConfig} from 'data/samples/sampleConfig';
import initialState from 'data/initialState';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {shallow, mount} from 'enzyme';
const middlewares = [thunk];
import {mockNetworkInterfaceWithSchema} from 'apollo-test-utils';
import {eMap} from 'helpers/componentHelpers';
import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import makeSchema from 'schema/schema';
import {createSelectorResolvedSchema} from 'schema/selectorResolvers';
import {InMemoryCache} from 'apollo-client-preset';
import {SchemaLink} from 'apollo-link-schema';
import MockProvider from 'redux-mock-provider';
import PropTypes from 'prop-types';


/**
 * Given a task, wraps it in promise and passes it to Jest's expect.
 * With this you can call resolves or rejects depending on whether success or failure is expected:
 * expectTask(task).resolves|rejects
 * @param {Task} task Task wrapped in a Promise and forked
 * @returns {undefined}
 */
export const expectTask = task => expect(taskToPromise(task));
/**
 * Same as expectTask but expects a rejects so diables debugging
 * @param {Task} task The Task
 * @returns {undefined}
 */
export const expectTaskRejected = task => expect(taskToPromise(task, true));

/**
 * Create an initial test state based on the sampleConfig for tests to use.
 * This should only be used for sample configuration, unless store functionality is being tested
 * @returns {Object} The initial state
 */
export const testState = () => initialState(sampleConfig);

/**
 * Creates a mock store from our sample data an our initialState function
 * @param {Object} sampleUserSettings Merges in sample local settings, like those from a browser cache
 * @type {function(*, *=)}
 */
export const makeSampleStore = (sampleUserSettings = {}) =>
  makeMockStore(initialState(sampleConfig), sampleUserSettings);

/**
 * Like test state but initializes a mock store. This will probably be unneeded
 * unless the middleware is needed, such as cycle.js
 * @param {Object} sampleUserSettings Merges in sample local settings, like those from a browser cache
 */
export const makeSampleInitialState = (sampleUserSettings = {}) => {
  return makeSampleStore(sampleUserSettings).getState();
};

/**
 * Simulates complete props from a container component by combining mapStateToProps, mapDispatchToProps, and props
 * that would normally passed from the container to a component
 * @param {Function} containerPropMaker A function from a container that expects a sample state and sampleOwnProps
 * and then applies the container's mapStateToProps, mapDispatchToProps, and optional mergeProps
 * @param sampleOwnProps Sample props that would normally come from the parent container
 * @returns {Object} complete test props
 */
export const propsFromSampleStateAndContainer = (containerPropMaker, sampleOwnProps = {}) =>
  containerPropMaker(makeSampleInitialState(), sampleOwnProps);

/**
 * Makes a mock store with the given state and optional sampleUserSettings. If the sampleUserSettings
 * they are merged into the state with deepMerge, so make sure the structure matches the state
 * @param {Object} state The initial redux state
 * @param {Object} sampleUserSettings Merges in sample local settings, like those from a browser cache
 * @returns {Object} A mock redux store
 */
export const makeMockStore = (state, sampleUserSettings = {}) => {
  const mockStore = configureStore(middlewares);
  // Creates a mock store that merges the initial state with local user settings.
  return mockStore(
    mergeDeep(
      state,
      sampleUserSettings
    )
  );
};

export const mockApolloClient = schema => {
  //addMockFunctionsToSchema({schema});
  const mockNetworkInterface = mockNetworkInterfaceWithSchema({schema});
  const apolloCache = new InMemoryCache();
  return new ApolloClient({
    cache: apolloCache,
    link: new SchemaLink({schema}),
    networkInterface: mockNetworkInterface
  });
};

/**
 * Wraps a component in as store context for Apollo/Redux testing
 * @param component
 * @return {*}
 */
export const shallowWithMockStore = (component) => {
  const resolvedSchema = createSelectorResolvedSchema(makeSchema(), makeSampleInitialState());
  const store = makeSampleStore();

  // shallow wrap the component, passing the Apollo client and redux store to the component and children
  // Also dive once to get passed the Apollo wrapper
  return mount(
    component,
    {
      context: {
        client: mockApolloClient(resolvedSchema),
        store
      },
      childContextTypes: {
        client: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
      }
    }
  )
};