/**
 * Redux store setup.
 * Includes the axios config.
 */
import React, {createContext, useReducer} from "react";
import rootReducer from './reducers';

const initialState = {
    user:{}
};

const Store = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default Store;
