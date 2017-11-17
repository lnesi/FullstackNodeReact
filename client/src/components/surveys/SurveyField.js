import React from "react";

export default ({ input, label, meta: { error, touched } }) => {
	
	return (
		<div className="input-field">
			<label className="active">{label}</label>
			<input {...input} style={{marginBottom:'5px'}} />
			<div className="red-text" style={{marginBottom:'25px'}}>
				{touched && error}
			</div>
		</div>
	);
};