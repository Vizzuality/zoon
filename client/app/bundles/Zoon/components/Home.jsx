import React from "react"
import $ from "jquery"
import * as F from "react-foundation"
import { Link } from "react-router"
import { push } from "react-router-redux"
import Code from "./Code"
import { connect } from "react-redux"

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentWillMount () {
    $("body").removeClass("not-home")
  }

  componentWillUnmount () {
    $("body").addClass("not-home")
  }

  onFieldChange (key, ev) {
    this.setState({
      [key]: ev.target.value,
    })
  }

  searchModules = (ev) => {
    ev.preventDefault()

    this.props.push(`/modules?searchQuery=${this.state.query}`)
  }

  render () {
    return (
      <span className="home">
        <F.Row>
          <F.Column small={12} large={8}>
            <h1>ZOON</h1>
            <p>ZOON reduces the time and effort it takes to find data, create species distribution models, and share that work. A step towards modifiable and reproducible modelling.</p>
          </F.Column>
        </F.Row>

        <div className="flow-banner" />

        <F.Row>
          <F.Column small={12} large={8}>
            <h3>EXPLORE MODULES</h3>
            <p>
              ZOON is an R package for Species Distribution Modelling* that allows you to develop your analysis as a reproducible workflow composed of 5 types of module (species <Link to="/modules?searchFamily=occurrence">occurrence</Link> data, <Link to="/modules?searchFamily=covariate">covariate</Link> data, <Link to="/modules?searchFamily=process">pre-processing</Link>, the <Link to="/modules?searchFamily=model">model</Link> and the <Link to="/modules?searchFamily=output">output</Link>).
            </p>
            <ul className="moduleTypes">
              {["occurrence", "covariate", "process", "model", "output"].map((type) => (
                <li key={type}><Link to={`/modules?searchFamily=${type}`} className={`module-family-${type} module-family-background`} /></li>
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
                <form onSubmit={this.searchModules}>
                  <input
                    type="text"
                    size="30"
                    className="search"
                    onChange={(ev) => this.onFieldChange("query", ev)}
                    placeholder="Or look for a specific one" />
                </form>
              </F.Column>
            </F.Row>

            <hr />

            <h3>CREATE WORKFLOWS</h3>
            <p>
              Traditional publishing and modelling practices don’t always help us to access, understand, modify or replicate Species Distribution Modelling studies. Despite the quality of the scientific work, without access to data and code we may not be able to do anything more than read the paper.
            </p>
            <p>
              Using the workflow publisher you can increase the accessibility, usability and quality of your work, or find existing work to inspire your latest research.
            </p>

            <Link to="/workflows/new" className="button">
              Try the Workflow Creator
            </Link>

            <hr />

            <h3>SHARE</h3>
            <p>
              You can upload your own work to the ZOON repository by submitting your modules and workflows here. Create tags, upload screen shots and get the most out of your work by enabling others.
            </p>

            <Link to="/workflows/new" className="button">
              Share your work
            </Link>

            <hr />

            <h3>DOWNLOAD NOW!</h3>
            <p>
              Whether you’re just getting started in Species Distribution Modelling*, or a very experienced scientist or scientific software engineer, ZOON offers a better way to develop our science. There are lots of modelling techniques and software available**. With ZOON, you can use all of the resources available in R.
            </p>
            <p>
              ZOON is on CRAN: <a href="https://cran.r-project.org/web/packages/zoon/index.html">https://cran.r-project.org/web/packages/zoon/index.html</a>
            </p>

            <Code>{"install.packages('zoon')"}</Code>

            <Code>library(zoon)</Code>

            <p>
              The latest version can be found on GitHub: <a href="https://github.com/zoonproject">https://github.com/zoonproject</a>
            </p>

            <Code>{"library(devtools)\ninstall_github('zoonproject/zoon')"}</Code>

            <Code>library(zoon)</Code>

            <p>
              See the tutorials for more details.
            </p>

            <ul>
              <li>
                <a href="http://rawgit.com/zoonproject/zoon/master/inst/doc/basic-zoon-usage.html">
                  Usage
                </a>
              </li>
              <li>
                <a href="http://rawgit.com/zoonproject/zoon/master/inst/doc/Building_a_module.html">
                  Building a module
                </a>
              </li>
              <li>
                <a href="http://rawgit.com/zoonproject/zoon/master/inst/doc/interactive_zoon_usage.html ">
                  Interactive ZOON usage
                </a>
              </li>
            </ul>

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
    push,
  })(Home)
