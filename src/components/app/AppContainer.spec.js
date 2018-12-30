import {eMap} from 'rescape-helpers-component';
import * as R from 'ramda';
import {c} from 'components/app/App';
import {apolloContainerTests} from 'rescape-helpers-component';
import {MemoryRouter as memoryRouter} from 'react-router-dom';
import {createSchema} from 'rescape-sample-data'
import {sampleInitialState} from '../../helpers/testHelpers';
import appContainer, {queries, mapStateToProps} from 'components/app/AppContainer';
import {chainedParentPropsTask} from 'components/app/AppContainer.sample';

const schema = createSchema();

const [AppContainer, MemoryRouter] = eMap([appContainer, memoryRouter]);
// Test this container with a memory router so we can test the main route

const Container = (...args) => MemoryRouter({initialEntries: [{pathname: '/', key: 'testKey'}]},
  AppContainer(...args)
);

// Find this React component
const componentName = 'App';
// Find this class in the data renderer
const childClassDataName = c.appBody;
// Find this class in the loading renderer
const childClassLoadingName = c.appLoading;
// Find this class in the error renderer
const childClassErrorName = c.appError;
const queryConfig = queries.userRegions;
// Set an invalid user id to query
const errorMaker = parentProps => R.set(R.lensPath(['user', 'id']), 'foo', parentProps);

describe('AppContainer', () => {
  const {testMapStateToProps, testQuery, testRenderError, testRender} = apolloContainerTests({
    initialState: sampleInitialState,
    schema,
    Container,
    componentName,
    childClassDataName,
    childClassLoadingName,
    childClassErrorName,
    queryConfig,
    chainedParentPropsTask,
    mapStateToProps,
    errorMaker
  });
  test('testMapStateToProps', testMapStateToProps);
  test('testQuery', testQuery);
  test('testRender', testRender);
  test('testRenderError', testRenderError);
});
