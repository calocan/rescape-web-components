/**
 * Created by Andy Likuski on 2016.05.26
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {styleMultiplier} = require('helpers/styleHelpers');
const PropTypes = require('prop-types');
const {makeMergeContainerStyleProps} = require('selectors/selectorHelpers');
const React = require('react');
const {eMap} = require('helpers/componentHelpers');
const {default: current} = require('components/current')
const [Div, Current] = eMap(['div', current]);
const {classNamer} = require('helpers/styleHelpers');

/**
 * The View for Main.
 *
 */
const Main = ({...props}) => {

  const nameClass = classNamer('main');
  const styles = makeMergeContainerStyleProps()(
    {
      style: {
        // Map props.styles to the root element
        root: reqPath(['style'], props),
      }
    },
    {
      root: {
        width: styleMultiplier(1),
        height: styleMultiplier(1)
      },
    });

  return Div({
      className: nameClass('root'),
      style: styles.root
    },
    Current({})
  );
};

/**
 * @type {{region: *}}
 */
Main.propTypes = {
  style: PropTypes.Shape({
  })
};

module.exports.default = Main;
