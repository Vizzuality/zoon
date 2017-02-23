import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router'
import Rating from 'react-rating'
import * as F from 'react-foundation';

export default ({ m }) => {
  return (
    <Link to={`/modules/${m.id}`} className="entity-wrapper" key={m.id}>
      <div className={`entity-card module-family-${m.family}`}>
        <div className="entity-content">
          <p className="entity-title">{m.title}</p>
          <div className="entity-version-and-ratings module-family-color">
            <span className="entity-version">V.{m.version}</span>
            <span className="entity-rating">
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
          <p className="entity-description">{m.description}</p>
        </div>
        <div className="entity-footer module-family-background-color">
          <span>{m.tags.map((tag) => (tag.name)).join(", ")}</span>
        </div>
      </div>
    </Link>
  );
};
