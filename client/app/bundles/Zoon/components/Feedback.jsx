import React from "react"
import Rating from "react-rating"

const Feedback = ({
  entity,
  currentUser,
  submitFeedback,
}) => (
  <div className="feedback">
    <div className="feedback-summary">
      <Rating
        initialRate={Math.round(entity.average_rating * 2) / 2}
        readonly
        empty="fa fa-star-o"
        full="fa fa-star"
        step={1}
        stop={5} />
      <span>{entity.rating_count} ratings</span>
      <span>{entity.comment_count} comments</span>
    </div>
    { entity.submit_feedback_path && (
      <FeedbackBox
        submitFeedbackPath={entity.submit_feedback_path}
        currentFeedback={entity.current_feedback}
        currentUser={currentUser}
        submitFeedback={submitFeedback}
      />
    ) }
    <FeedbackList comments={entity.comments} />
  </div>
)

class FeedbackBox extends React.Component {
  constructor (props) {
    super(props)

    let cf = this.props.currentFeedback
    this.state = {
      rating: cf && cf.rating,
      comment: cf && cf.comment || "",
    }
  }

  componentWillReceiveProps (newProps) {
    const cf = newProps.currentFeedback

    this.setState({
      rating: cf && cf.rating,
      comment: cf && cf.comment || "",
    })
  }

  render () {
    return (
      <div className="feedback-box">
        <img src={this.props.currentUser.avatar_url} />

        <form className="provide-feedback" onSubmit={this.submitFeedback}>
          <input
            type="text"
            name="comment"
            value={this.state.comment}
            onChange={this.updateComment}
            placeholder="How did you use this module?" />
        </form>

        <Rating
          initialRate={this.state.rating}
          onChange={this.updateRating}
          empty="fa fa-star-o"
          full="fa fa-star"
          step={1}
          stop={5} />
      </div>
    )
  }

  updateComment = (ev) => {
    this.setState({comment: ev.target.value})
  }

  updateRating = (value) => {
    this.setState({rating: value})
  }

  submitFeedback = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    this.props.submitFeedback(
      this.props.submitFeedbackPath,
      this.state.rating,
      this.state.comment,
    )
  }
}

const FeedbackList = ({
  comments,
}) => {
  if (!comments) { return null }
  return (
    <div className="comments-list">
      { comments.map((c) => (
        <div key={c.id} className="comment">
          <img src={c.user.avatar_url} />
          <div className="comment-body">
            <p>
              {c.user.name}
              <span className="days-ago-created">
                {Math.round((new Date() - new Date(c.created_at)) / 86400 / 1000)} days ago
              </span>
              { c.created_at !== c.updated_at &&
                <span className="days-ago-updated">(last updated {Math.round((new Date() - new Date(c.updated_at)) / 86400 / 1000)} days ago)</span>
              }
            </p>
            <p>
              <Rating
                readonly
                initialRate={Math.round(c.rating * 2) / 2}
                empty="fa fa-star-o"
                full="fa fa-star"
                fractions={2}
                step={1}
                stop={5} />
            </p>
            <p>{c.comment}</p>
          </div>
        </div>
      )) }
    </div>
  )
}

export default Feedback
