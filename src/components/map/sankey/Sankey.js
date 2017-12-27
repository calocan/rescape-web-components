/**
 * Created by Andy Likuski on 2017.09.04
 * Copyright (c) 2017 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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

import mapGl from 'react-map-gl';
import {throwing} from 'rescape-ramda';
import {
  composeViews, eMap, errorOrLoadingOrData, nameLookup, propsFor,
  propsForSansClass, renderErrorDefault, renderLoadingDefault, reqStrPath
} from 'helpers/componentHelpers';
import * as R from 'ramda';
import {applyStyleFunctionOrDefault, styleMultiplier} from 'helpers/styleHelpers';
import {applyMatchingStyles, mergeAndApplyMatchingStyles} from 'selectors/styleSelectors';
import {Component} from 'react/cjs/react.production.min';
import deckGL, {OrthographicViewport} from 'deck.gl';
import {sankeyGenerator} from 'helpers/sankeyHelpers';
import sample from 'data/sankey.sample';
import PropTypes from 'prop-types';
import { geoMercator, geoPath } from 'd3-geo'
const projection = geoMercator()
const pathGenerator = geoPath().projection(projection)

const [MapGL, DeckGL, Svg, G, Circle, Div] =
  eMap([mapGl, deckGL, 'svg', 'g', 'circle', 'div']);

export const c = nameLookup({
  sankey: true,
  asankeyMapGlOuter: true,
  sankeyMapGl: true,
  svg: true,
  sankeyLoading: true,
  sankeyError: true
});
const {reqPath} = throwing;

/**
 * The View for a Sankey on a Map
 */
class Sankey extends Component {
  render() {
    const props = Sankey.views(this.props);
    return Div(propsFor(c.mapbox, props.views),
      Sankey.choicepoint(props)
    );
  }
}

Sankey.getStyles = ({style}) => {

  const parentStyle = R.merge(
    {
      // default these parent styles
      width: '100%',
      height: '100%'
    },
    style
  )

  return {
    [c.sankey]: mergeAndApplyMatchingStyles(parentStyle, {
      position: 'absolute',
      width: styleMultiplier(1),
      height: styleMultiplier(1)
    }),

    [c.sankeyMapGl]: applyMatchingStyles(parentStyle, {
      width: styleMultiplier(1),
      height: styleMultiplier(1)
    })
  };
};

Sankey.viewProps = (props) => {
  // Width and height need to be passed as properties
  const width = reqPath(['views', [c.sankey], 'style', 'width'], props);
  const height = reqPath(['views', [c.sankey], 'style', 'height'], props);
  const left = -Math.min(width, height) / 2;
  const top = -Math.min(width, height) / 2;
  //const glViewport = new OrthographicViewport({width, height, left, top});
  return {
    [c.sankeyMapGl]: R.merge({
        width,
        height
      },
      // Pass anything in the viewport
      reqStrPath('data.viewport', props)
    ),
    [c.svg]: {
      viewBox: `0 0 ${width} ${height}`
    }
    //osm: 'store.region.geojson.osm'
  };
};

Sankey.viewActions = () => {
  return {
    [c.sankeyMapGl]: ['onViewportChange', 'hoverMarker', 'selectMarker']
  };
};

Sankey.renderData = ({views}) => {
  /* We additionally give Mapbox the container width and height so the map can track changes to these
   We have to apply the width and height fractions of this container to them.
   */
  const props = R.flip(propsFor)(views);
  const propsSansClass = R.flip(propsForSansClass)(views);

  let refs = {}
  return Div(props(c.mapboxMapGlOuter),
    MapGL(propsSansClass(c.mapboxMapGl),
      Svg(R.merge(props(c.svg), {ref: node => {refs.node = node}}),
        // TODO first argument needs to be opt from the SVGOverlay layer. See MapMarkers
        sankeyGenerator(null, props(c.svg), sample)
      )
    )
  );
};

/**
 * Adds to props.views for each component configured in viewActions, viewProps, and getStyles
 * @param {Object} props this.props or equivalent for testing
 * @returns {Object} modified props
 */
Sankey.views = composeViews(
  Sankey.viewActions(),
  Sankey.viewProps,
  Sankey.getStyles
);

/**
 * Loading, Error, or Data based on the props
 */
Sankey.choicepoint = errorOrLoadingOrData(
  renderErrorDefault(c.sankeyError),
  renderLoadingDefault(c.sankeyLoading),
  Sankey.renderData
);

Sankey.propTypes = {
  data: PropTypes.shape().isRequired,
  style: PropTypes.shape().isRequired
};

export default Sankey;
