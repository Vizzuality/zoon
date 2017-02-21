import React, { PropTypes } from 'react';
import Rating from 'react-rating'

const Feedback = ({
  entity,
  currentUser,

  submitFeedback,
}) => {
  return <div className="comments">
    <div className="stats">
      <h4>Stats</h4>
      <div>Average rating: {entity.average_rating}</div>
      <div>Rating coun: {entity.rating_count}</div>
      <div>Comment count: {entity.comment_count}</div>
    </div>
    { currentUser.id && (
      <div>
        <h4>Your feedback</h4>
        <FeedbackBox
          entity={entity}
          currentUser={currentUser}
          submitFeedback={submitFeedback}
        />
      </div>
    ) }
    <div>
      <h4>Comments</h4>
      <FeedbackList comments={entity.comments}/>
    </div>
  </div>
}

class FeedbackBox extends React.Component {
  constructor(props){
    super(props)

    let cf = this.props.entity.current_feedback;
    this.state = {
      rating: cf && cf.rating || undefined,
      comment: cf && cf.comment || '',
    };

    this.updateComment = this.updateComment.bind(this)
    this.updateRating = this.updateRating.bind(this)
    this.submitFeedback = this.submitFeedback.bind(this)
  }

  render(){
    return <form className="provide-feedback" onSubmit={this.submitFeedback}>
      <div>Your avatar: {this.props.currentUser.avatar_url}</div>
      <Rating
        initialRate={this.state.rating}
        onChange={this.updateRating}
      />
      <input
        type="text"
        name="comment"
        value={this.state.comment}
        onChange={this.updateComment}
        placeholder="How did you use this module?"
      />
      <input type="submit" value="Give feedback" />
    </form>
   }

  updateComment(ev){
    this.setState({comment: ev.target.value})
  }

  updateRating(value){
    this.setState({rating: value})
  }

  submitFeedback(ev){
    ev.preventDefault()
    ev.stopPropagation()

    this.props.submitFeedback(
      this.props.entity.id,
      this.state.rating,
      this.state.comment,
    )
  }
}

const FeedbackList = ({
  comments,
}) => {
  if (!comments){ return null; }
  return <div className="comments-list">
    { comments.map((c) => (
      <div key={c.id} className="comment">
        <div>{c.user.email} dixit:</div>
        <Rating
          initialRate={c.rating}
          readonly={true}
        />
        <div>{c.comment}</div>
      </div>
    )) }
  </div>
}

export default Feedback;
