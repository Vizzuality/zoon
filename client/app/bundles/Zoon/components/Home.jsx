import React from 'react';
import * as F from 'react-foundation';
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import Code from './Code'
import { connect } from 'react-redux';


class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount () {
    $("body").removeClass("not-home")
  }

  componentWillUnmount () {
    $("body").addClass("not-home")
  }

  onFieldChange(key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  searchModules (ev) {
    ev.preventDefault();

    this.props.push(`/modules?searchQuery=${this.state.query}`);
  }

  render () {
    return (
      <span className="home">
        <F.Row>
          <F.Column small={12} large={8}>
            <h1>ZOON</h1>
            <p>Modelling isn’t always easy, but it could be easier. ZOON reduces the time and effort it takes to find data, create species distribution models, and share them with the world.</p>
          </F.Column>
        </F.Row>

        <div className="flow-banner"></div>

        <F.Row>
          <F.Column small={12} large={8}>
            <h3>CREATE</h3>
            <p>
              ZOON is an R package for Species Distribution Modelling* that allows you to develop your analysis as a reproducible workflow composed of 5 types of module (species <Link to="/modules?searchFamily=ocurrence">occurrence</Link> data, <Link to="/modules?searchFamily=covariate">covariate</Link> data, <Link to="/modules?searchFamily=process">pre-processing</Link>, the <Link to="/modules?searchFamily=model">model</Link> and the <Link to="/modules?searchFamily=output">output</Link>).
            </p>
            <ul className="moduleTypes">
              {["occurrence", "covariate", "process", "model", "output"].map((type) => (
              <li key={type}><Link to={`/modules?searchFamily=${type}`} className={type}></Link></li>
             ))}
            </ul>
            <p>
              Modules are bite sized chunks of code that piece together in a whole workflow. In the Zoon R Package there is a huge collection of modules, from country-level presence/absence survey data to key models to run the data through.
            </p>

            <F.Row>
              <F.Column className="shrink">
                <Link
                    to="/modules"
                    className="button">
                  Explore the modules
                </Link>
              </F.Column>
              <F.Column className="shrink">
                <form onSubmit={this.searchModules.bind(this)}>
                  <input
                      type="text"
                      size="30"
                      className="search"
                      onChange={(ev) => this.onFieldChange("query", ev)}
                      placeholder="Or look for a specific one"/>
                </form>
              </F.Column>
            </F.Row>

            <hr />

            <h3>PUBLISH</h3>
            <p>
              The current method of creating and publishing species distribution models doesn’t lend itself to conversation, modification or replication. Despite some amazing pieces of work being available to read we cannot always access the data and code.
            </p>
            <p>
              Using the workflow publisher you can increase the accessibility, usability and quality of your work, or find existing work to inspire your latest research.
            </p>

            <Link to='/workflows/new' className="button">
              Try the Workflow Publisher
            </Link>

            <hr />

            <h3>DOWNLOAD NOW!</h3>
            <p>
              Whether you’re just getting started in Species Distribution Modelling*, or a very experienced scientist or scientific software engineer, ZOON offers a better way to develop our science. There are lots of modelling techniques and software available**. ZOON can use all of the resources available in R.
            </p>
            <p>
              ZOON is on CRAN: <a href="https://cran.r-project.org/web/packages/zoon/index.html">https://cran.r-project.org/web/packages/zoon/index.html</a>
            </p>

            <Code>{`install.packages('zoon')`}</Code>

            <Code>library(zoon)</Code>

            <p>
              The latest version can be found on GitHub: <a href="https://github.com/zoonproject">https://github.com/zoonproject</a>
            </p>

            <Code>{`library(devtools)\ninstall_github('zoonproject/zoon')`}</Code>

            <Code>library(zoon)</Code>

            <p>
              See the <a href="#">tutorials</a> for more details.
            </p>

            <hr />

            <p className="citation">
              * Species Distribution Modelling has many related names with subtle differences and many similarities such as Ecological or Environmental Niche Modelling, Bio-climate Modelling, Habitat Suitability Modelling, Resource Selection Modelling, Climate Envelope Modelling, Climate Affinity Modelling…
            </p>
            <p className="citation">
              ** MaxEnt, R, BioMod, OpenModeller, ModEco, GARP, BioMapper, Canoco,Winbugs, OpenBugs, Domain, ANN, AquaMaps, BioClim, BRT, CSM, CTA, ENFA, Envelope Score, Env Distance, GA, GAM, GBM, Dismo, Glm, GLS, Mahalanobis Distance, MARS, Random Forests, Species, HyperNiche, SRE,SVM , Graf, INLA, BayesComm…
            </p>
          </F.Column>
        </F.Row>
      </span>
    )
  }
}

export default connect(
  (state) => ({
  }),
  {
    push
  })(Home);
