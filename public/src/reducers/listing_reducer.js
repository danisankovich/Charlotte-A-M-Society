import {
  FETCH_LISTINGS, FETCH_MY_LISTINGS, FETCH_SINGLE_LISTING, NEW_LISTING, EDIT_LISTING
} from '../actions/types';
export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_LISTINGS:
      return {...state, listings: action.payload};
    case FETCH_MY_LISTINGS:
      return {...state, mylistings: action.payload};
    case FETCH_SINGLE_LISTING:
      return {...state, listing: action.payload};
    case NEW_LISTING:
      return {...state, listing: action.payload};
    case EDIT_LISTING:
      return {...state, listing: action.payload};
  }
  return state;
}
