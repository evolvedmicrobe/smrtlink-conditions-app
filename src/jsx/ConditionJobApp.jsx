import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import { Button, ButtonInput, ButtonToolbar, Panel, Input, FormControls, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';


const exampleCsvContents = "condId,host,jobId\nA7-Flea,smrtlink-beta,27976\nA7-SB,smrtlink-beta,27981";

const defaultValues = {
  pipelineId: "pbpipelines_internal.pipelines.internal_cond_r_plots",
  name: "Plot R Resequencing Comparison Plots",
  description: "Shows how to demo the program.",
  csvContents: exampleCsvContents};



const FT_COND_RESEQ = "PacBio.FileTypes.COND_RESEQ";


export class ConditionSubmitter extends React.Component {

  constructor(props) {
    super(props);
    this.server = props.server;
    this.port = props.port;
    //this.postUrl = `${this.props.server.url}/api/create-reference`;
    this.postUrl = `${this.server}:${this.port}/secondary-analysis/job-manager/jobs/conditions`;
    console.log(`Initializing with pipelines ${props.pipelines.length}`);
    this.pipelines = props.pipelines;

    this.state = {
      pipelineId: defaultValues.pipelineId,
      name: defaultValues.name,
      description: defaultValues.description,
      csvContents: exampleCsvContents,
      successMessage: null,
      errorMessage: null
    };

    this.handleSubmission = this.handleSubmit.bind(this)

  }

  componentWillReceiveProps(nextProps) {
    console.log(`Called with next props ${nextProps}`);
    console.log(JSON.stringify(nextProps));
    this.pipelines = nextProps.pipelines;
    // this should set pipelineId to first value
    let p = nextProps.pipelines[1];
    let sx = {pipelineId: p.id,  name: p.name, description: p.description};
    console.log(`setting state to ${sx}`);
    this.setState(sx);
  }

  handleJobDescriptionChange(e) {
    this.setState({description: e.target.value});
  }

  handleNameChange(e) {
    console.log(`Setting name to ${e.target.value}`);
    this.setState({name: e.target.value});
  }

  handlePipelineIdChange(e) {
    console.log(`Setting pipeline id to ${e.target.value}`);
    this.setState({pipelineId: e.target.value});
  }

  handleCsvContentsChange(e) {
    this.setState({csvContents: e.target.value})
  }

  handleSubmit(e) {

    e.preventDefault();

    let name = this.state.name.trim();
    let description = this.state.description.trim();
    let pipelineId = this.state.pipelineId.trim();
    let csvContents = this.state.csvContents.trim();

    // this is just for debugging. It's not required
    // in the POST request
    let createdAt = new Date();

    let datum = {
      csvContents: csvContents,
      pipelineId: pipelineId,
      name: name,
      description: description,
      createdAt: createdAt.toISOString()
    };

    console.log(`Condition Job Submitting ${this.postUrl} with payload ${createdAt.toISOString()}`);

    const payload = JSON.stringify(datum);
    //console.log(payload);

    const headers = {};

    jQuery.ajax({
      url: this.postUrl,
      type: 'POST',
      headers: headers,
      contentType: "application/json",
      data: payload,
      cache: true,
      success: (data) => {
        console.log("Successfully created Condition Job");
        console.log(JSON.stringify(data));

        this.setState({data: data});

        let jobId = data.id;
        let jobState = data.state;

        // FIXME the SL port is hardcoded
        let msg = <div>Successfully Created Job {jobId} in State {jobState} <a href={`${this.server}:8080/#/analysis/job/${jobId}`} target="_blank">Go To Job</a></div>;

        // reset form values, but leave value of the current selected pipeline-id
        this.setState({
          successMessage: msg,
          errorMessage: null});
      },
      error: (xhr, textStatus, err) => {
        // Propagate error to error div
        this.setState({
          errorMessage: `Error submitting to ${this.postUrl} Message '${err.toString()}' \nProblem is: '${xhr.responseJSON.message.toString()}'`,
          successMessage: null});
        console.error(this.postUrl, textStatus, err.toString());
      },
      fail: (xhr, textStatus, err) => {
        this.setState({
          errorMessage: `Failed to submit to ${this.postUrl} ${err.toString()}`,
          successMessage: null});
        console.error(this.postUrl, textStatus, err.toString());
      }
    });
  }

  render() {

    var errorMsg;
    if (this.state.errorMessage === null) {
      errorMsg = ""
    } else {
      errorMsg = <div className="alert alert-danger"><strong>Error Submitting to {this.postUrl} </strong> {this.state.errorMessage}</div>
    }

    var successMsg;
    if (this.state.successMessage === null ) {
      successMsg = ""
    } else {
      successMsg =  <div className="alert alert-success">{this.state.successMessage}</div>
    }

    return (
        <div>
          <form className="form-horizontal" >

            <div className="form-group">
              <label htmlFor="referenceName" className="control-label col-xs-2">Job Name</label>
              <Input
                  id="dsName"
                  type="text"
                  placeholder="Job Name"
                  value={this.state.name}
                  onChange={this.handleNameChange.bind(this)}
                  labelClassName="col-xs-2"
                  wrapperClassName="col-xs-4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobDescription" className="control-label col-xs-2">Job Description</label>
              <Input
                  id="fastaPath"
                  type="text"
                  placeholder="Job Description"
                  value={this.state.description}
                  onChange={this.handleJobDescriptionChange.bind(this)}
                  labelClassName="col-xs-2"
                  wrapperClassName="col-xs-4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dsOrganism" className="control-label col-xs-2">Condition Pipeline ID</label>
              <select name="selPipeline" class="selectpicker" onChange={this.handlePipelineIdChange.bind(this)} value = {this.state.pipelineId}>
                {this.pipelines.map((px, index) => <option key={index} value={px.id} > {px.name} </option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="conditionCsv" className="control-label col-xs-2">Condition CSV</label>
                <FormControl componentClass="textarea"
                             placeholder={exampleCsvContents}
                             value={this.state.csvContents}
                             rows="10"
                             labelClassName="col-xs-offset-4 col-xs-2"
                             wrapperClassName="col-xs-offset-4 col-xs-4"
                             onChange={this.handleCsvContentsChange.bind(this)} />
            </div>



            <div>
              <div className="col-xs-offset-4 col-xs-8">
                <Button
                    disabled={false}
                    type={"button"}
                    bsStyle="primary"
                    onClick={this.handleSubmission} >Submit Condition Job creation</Button>
              </div>
            </div>

          </form>
          {errorMsg}
          {successMsg}
        </div>)
  }
}


export class ConditionCsv extends React.Component {

  constructor(props) {
    super(props);
    this.server = props.server;
    this.port = props.port;
    this.pipelineUrl = `${props.server}:${props.port}/secondary-analysis/resolved-pipeline-templates`;
    this.state = {pipelines: [], errorMessage: null};
  }

  isConditionPipeline(p) {
   var bad = ["Dev Reseq Cond Report",
              "Dev Align Report",
              "Dev R (hello world)",
              "Dev R (hello+Report)",
              "Train and Validate CCS Model"];              
    return(bad.indexOf(p.name) == -1 && p.entryPoints
        .map(function(x) {return(x.fileTypeId === FT_COND_RESEQ)})
        .reduce((prev, curr) => prev && curr));
  }

  convertPipelines(allPipelines) {
    // extract the minimal amount of information
    return(allPipelines.map(function (x) { return({id: x.id, name: x.name, description:  x.description})}));
  }

  loadPipelines() {
    jQuery.ajax({
      url: this.pipelineUrl,
      dataType: 'json',
      cache: false,
      success: (data) => {

        let conditionPipelines = this.convertPipelines(data.filter(this.isConditionPipeline));

        console.log(JSON.stringify(conditionPipelines));
        // if the call was successfully, then the system is up and running.
        var statusMsg = `Successful connect to ${this.pipelineUrl} ${conditionPipelines.length} Condition pipelines loaded`;
        console.log(statusMsg);
        this.setState({pipelines: conditionPipelines})
      },
      error: (xhr, status, err) => {
        // FIXME. Better error message when the pipeline-templates service returns and Error
        var statusMsg = "Error connecting to " + this.statusUrl + " " + status + " " + err.toString();
        console.log(statusMsg);
        this.setState({errorMessage: statusMsg})
      },
      fail: (xhr, textStatus, err) => {
        let statusMsg = "Failed to connect to " + this.statusUrl + " " + textStatus + " " + err.toString();
        console.error(statusMsg);
        this.setState({errorMessage: statusMsg});
      }
    });
  }

  componentDidMount() {
    this.loadPipelines()
  }

  render() {
    return <ConditionSubmitter server={this.server} port={this.port} pipelines={this.state.pipelines} />;
  }
}


export class ConditionApp extends React.Component {
  render() {
    return <div>
      <Panel header={"CSV Condition Builder "} >
        <ConditionCsv server={"http://smrtlink-internal"} port={ 8081 } />
      </Panel>
    </div>
  }
}


ReactDOM.render(
  <ConditionApp />, document.getElementById('content')
);