import React from "react"
import * as F from "react-foundation"

class SearchQueryFilter extends React.Component {
  static propTypes = {
    searchQuery: React.PropTypes.string,
    committer: React.PropTypes.func.isRequired,
  }

  onSearch = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.committer({
      searchQuery: this.searchQueryInput.value,
    })
  }

  render () {
    const {
      searchQuery,
    } = this.props

    return searchQuery !== undefined && <F.Row>
      <F.Column small={12}>
        <h4>Filter by text</h4>
        <form onSubmit={this.onSearch}>
          <input
            type="text"
            placeholder="Search term will match module name, description, and tags"
            defaultValue={searchQuery}
            ref={input => { this.searchQueryInput = input }}
          />
        </form>
      </F.Column>
    </F.Row>
  }
}

export default SearchQueryFilter
