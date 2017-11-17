import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import SurveyField from "./SurveyField";
import _ from "lodash";
import { Link } from "react-router-dom";
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';



class SurveyForm extends Component {
	renderFields() {
		return _.map(formFields, ({ name, label }) => {
			return (
				<Field
					label={label}
					type="text"
					name={name}
					key={name}
					component={SurveyField}
				/>
			);
		});
	}

	render() {
		return (
			<div>
				<form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
					{this.renderFields()}
					<Link to="/surveys" className="red btn-flat white-text">
						Cancel
					</Link>
					<button className="teal btn-flat right white-text" type="submit">
						Next
						<i className="material-icons right">done</i>
					</button>
				</form>
			</div>
		);
	}
}

function validate(values) {
	const errors = {};
	_.each(formFields, ({ name }) => {
		if (!values[name]) {
			errors[name] = "This field is require";
		}
	});
	if(!errors.recipients) errors.recipients=validateEmails(values.recipients || '');

	return errors;
}

export default reduxForm({
	validate,
	form: "surveyForm",
	destroyOnUnmount:false
})(SurveyForm);