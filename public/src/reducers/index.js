import { combineReducers } from 'redux';
import { reducer as form} from 'redux-form';
import authReducer from './auth_reducer';
import listingReducer from './listing_reducer';
import blogReducer from './blog_reducer';
const rootReducer = combineReducers({
  form,
  auth: authReducer,
  listing: listingReducer,
  blogs: blogReducer
});

export default rootReducer;
