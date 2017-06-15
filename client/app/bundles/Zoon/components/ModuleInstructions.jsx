import React from "react"
import * as F from "react-foundation"
import { Link } from "react-router"
import classnames from "classnames"

const moduleIndex = "/modules/"
const steps = [
  {
    label: "01",
    content: <ul>
      <li>Fork the project.</li>
      <li>Make your feature addition or bug fix.</li>
    </ul>,
  },
  {
    label: "02",
    content: <ul>
      <li>
        Add tests for it. This is important so we don't break it in a future
        version unintentionally.
      </li>
      <li>
        [Optional] Run the tests agaist a specific Gemfile:<br />
        <code>$ bundle exec appraisal rails_5.0 rake spec</code>
      </li>
    </ul>,
  },
  {
    label: "03",
    content: <ul>
      <li>
        Run the tests agaist all supported versions:<br />
        <code>$ bundle exec rake</code><br />
        <code>$ bundle exec wwtd</code><br />
      </li>
      <li>
        Commit, but please do not mess with <code>Rakefile</code>, version, or
        history.<br />
        <code>$ bundle exec appraisal rails_5.0 rake spec</code>
      </li>
      <li>
        Send a Pull Request. Bonus points for topic branches.
      </li>
    </ul>,
  },
]

export default class ModuleInstructions extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      stepId: React.PropTypes.string.isRequired,
    }).isRequired,
  }

  render () {
    const stepId = parseInt(this.props.params.stepId) || 1
    const stepOffset = stepId - 1
    const {label, content} = steps[stepOffset]

    return (
      <span className="module-instructions theatre">
        <F.Row>
          <F.Column
            small={4}
            offsetOnSmall={8}
            className="flex-flush-right"
          >
            <Link
              className="button need-help hollow"
              to="mailto:zoonproject@gmail.com"
            >
              Need help? Contact us
            </Link>
          </F.Column>
        </F.Row>

        <F.Row className="stage">
          <F.Column small={6} offsetOnSmall={1}>
            {content}
          </F.Column>
          <F.Column small={5} className={`step step-${label}`} />
        </F.Row>

        <F.Row>
          <F.Column small={12} className="pit">
            <div className="status">
              {steps.map((s, i) =>
                <Link
                  key={i}
                  className={classnames("tab", {active: i === stepOffset})}
                  to={`/modules/instructions/${i + 1}`}
                >
                  {s.label}
                </Link>
              )}
            </div>
            <div className="contents">
              <Link className="button hollow back" to={moduleIndex}>
                Back
              </Link>
              {
                stepOffset === steps.length - 1
                ? ""
                : (
                  <Link
                    className="button continue"
                    to={`/modules/instructions/${stepId + 1}`}
                  >
                    Continue
                  </Link>
                )
              }
            </div>
          </F.Column>
        </F.Row>
      </span>
    )
  };
}
