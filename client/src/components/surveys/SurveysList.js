import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';


class SurveysList extends Component{
	
	componentDidMount(){
		this.props.fetchSurveys();
	}
	renderSurveys(){
		console.log(this.props.surveys)
		return this.props.surveys.reverse().map(survey=>{
			return (
				<div className="card blue-grey darken-1 white-text" key={survey._id}>
					<div className="card-content">
						<span className="card-title">{survey.title}</span>
						<p>{survey.body}</p>
						<p className="right">
							Sent On: {new Date(survey.dateSent).toLocaleDateString()}
						</p>
					</div>
					<div className="card-action">
						<a>Yes: {survey.yes}</a>
						<a>No: {survey.no}</a>
					</div>
				</div>
			)
		})
	}
	render(){
		return(
			<div>
				{this.renderSurveys()}
			</div>
		)
	}
}
function mapStateToProps({surveys}){
	console.log(surveys);
	return {surveys};
}

export default connect(mapStateToProps,{fetchSurveys})(SurveysList)