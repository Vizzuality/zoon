import React from "react"
import { Link } from "react-router"
import Rating from "react-rating"

export default ({ m, onClick }) => {
  const body = (
    <div className={`entity-card module-family-${m.family}`}>
      <div className="entity-content">
        <p className="entity-title">{m.title}</p>
        <div className="entity-version-and-ratings module-family-color">
          <span className="entity-version">V.{m.version}</span>
          <span className="entity-rating">
            <Rating
              readonly
              initialRate={Math.round(m.average_rating * 2) / 2}
              empty="fa fa-star-o"
              full="fa fa-star"
              fractions={2}
              step={1}
              stop={5} />
          </span>
        </div>
        <p className="entity-description">{m.description}</p>
      </div>
      <div className="entity-footer module-family-background-color">
        <span>{m.tags.map((tag) => (tag.name)).join(", ")}</span>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <div onClick={onClick} className="entity-wrapper">
        {body}
      </div>
    )
  } else {
    return (
      <Link to={`/modules/${m.id}`} className="entity-wrapper">
        {body}
      </Link>
    )
  }
}
