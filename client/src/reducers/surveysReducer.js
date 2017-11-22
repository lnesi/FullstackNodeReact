import { FETCH_SURVEYS } from "../actions/types";

export default function(state=[],action){

	switch(action.type){
		case FETCH_SURVEYS:
		console.log(action);
			return action.payload;
		default:
			return state;
	}
}