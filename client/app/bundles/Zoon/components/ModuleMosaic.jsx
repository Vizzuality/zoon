import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Rating from 'react-rating'
import * as F from 'react-foundation';

const ModuleMosaic = ({ models }) => {
  return (<div className="module-mosaic">
    {models.map(m => (
      <Link to={`/modules/${m.id}`} className="module-wrapper" key={m.id}>
        <div className="module">
          <div className="module-content">
            <p className="module-title">{m.title}</p>
            <div className={`module-version-and-ratings ${m.family}`}>
              <span className="module-version">V.{m.version}</span>
              <span className="module-rating">
                <Rating
                  readonly={true}
                  initialRate={Math.round(m.average_rating*2)/2}
                  empty="fa fa-star-o"
                  full="fa fa-star"
                  fractions={2}
                  step={1}
                  stop={5}/>
              </span>
            </div>
            <p className="module-description">{m.description}</p>
          </div>
          <div className={`module-footer ${m.family}`}>
            <span>{m.tags.map((tag) => (tag.name)).join(", ")}</span>
          </div>
        </div>
      </Link>
    ))}
  </div>);
};

export default connect(
  (state) => ({
  }),
  {
  }
)(ModuleMosaic);
