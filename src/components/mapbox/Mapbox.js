/**
 * Created by Andy Likuski on 2017.02.16
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import PropTypes from 'prop-types';
import mapGl from 'react-map-gl';
import React from 'react';
import createMapStops from 'components/mapStop';
import MapMarkers from 'components/mapMarker';
import {throwing} from 'rescape-ramda';
import Deck from '../deck/Deck';
import {eMap, liftAndExtractItems} from 'helpers/componentHelpers';
import * as R from 'ramda';
import {classNamer, getClassAndStyle} from 'helpers/styleHelpers';
import {makeMergeContainerStyleProps} from 'selectors/styleSelectors';

const [Div, MapGl] = eMap(['div', mapGl]);
const MapStops = createMapStops(React);
const {reqPath} = throwing;

const Mapbox = ({style, views: {mapGl: mapGlProps}}) => {

  const nameClass = classNamer('mapbox');
  const styles = makeMergeContainerStyleProps()(
    {
      style: {
        root: style
      }
    },
    {
      root: {
        position: 'absolute',
        width: '100%',
        height: '100%'
      }
    });

  //const {iconAtlas, showCluster, hoverMarker, selectMarker} = this.props;
  //const {node, way} = reqPath(['osmByType'], this.props) || {};
  //const markers = {type: 'FeatureCollection', features: reqPath(['state', 'markers'], this) || []};

  // <MapStops geojson={node || {}} viewport={viewport}/>,
  // <MapLines geojson={way || {}} viewport={viewport}/>,
  /*
  const mapMarkers = e(MapMarkers, {
    geojson: markers,
    viewport,
    regionId: this.props.region.id
  });
  */
  /*
  const deck = e(Deck, reqPath(['deck'], views));
    viewport,
    geojson: markers,
    iconAtlas,
    showCluster,
    onHover: hoverMarker,
    onClick: selectMarker
  */

  return Div(getClassAndStyle('root', styles),
    MapGl(mapGlProps)
  );

  /*
      mapboxApiAccessToken,

      onChangeViewport: this.props.onChangeViewport
    deck
  );
  */
};

Mapbox.propTypes = {

  settings: PropTypes.shape({
    style: PropTypes.object.isRequired,
    iconAtlas: PropTypes.string.isRequired,
    showCluster: PropTypes.bool.isRequired
  }).isRequired,

  data: PropTypes.shape({
    regions: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      osm: PropTypes.shape({
        featuresByType: PropTypes.shape().isRequired,
        markersByType: PropTypes.shape().isRequired
      }).isRequired,
      mapbox: PropTypes.shape({
        mapboxApiAccessToken: PropTypes.string.isRequired,
        viewport: PropTypes.shape().isRequired
      }).isRequired
    }).isRequired
  }).isRequired,

  // Custom PropTypes function to expect one user key
  users: R.compose(
    (props, propName, componentName) => {
      const length = R.length(R.keys(props[propName]));
      if (R.equals(1, length)) {
        return new Error(
          `Invalid prop ${propName} supplied to ${componentName}.
           Validation failed. Object length is not one, rather ${length}`
        );
      }
    },
    PropTypes.objectOf(PropTypes.shape({}))
  ).isRequired,

  actions: PropTypes.shape({
    hoverMarker: PropTypes.func.isRequired,
    selectMarker: PropTypes.func.isRequired,
    onChangeViewport: PropTypes.func.isRequired
  }).isRequired
};

export default Mapbox;


