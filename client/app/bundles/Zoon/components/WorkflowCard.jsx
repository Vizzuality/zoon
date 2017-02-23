import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Rating from 'react-rating'
import * as F from 'react-foundation';

export default ({ w }) => {
  return (
    <Link to={`/workflows/${w.id}`} className="entity-wrapper" key={w.id}>
      <div className={`entity-card entity-family-${w.family}`}>
        <div className="entity-content">
          <p className="entity-title">{w.title}</p>
          <div className="entity-version-and-ratings module-family-color">
            <span className="entity-rating">
              <Rating
                readonly={true}
                initialRate={Math.round(w.average_rating*2)/2}
                empty="fa fa-star-o"
                full="fa fa-star"
                fractions={2}
                step={1}
                stop={5}/>
            </span>
          </div>
          <p className="entity-description">{w.description}</p>
        </div>
        <div className="entity-footer module-family-background-color">
          <span>{w.tags.map((tag) => (tag.name)).join(", ")}</span>
        </div>
      </div>
    </Link>
  );
};
