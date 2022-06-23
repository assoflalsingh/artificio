import { useCallback, useState } from "react";
import { getInstance } from "../others/artificio_api.instance";

const useApi = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	
	const apiRequest = useCallback((requestConfig, callBack) => {
		// const api = getInstance(requestConfig.token);
		const api = getInstance(localStorage.getItem('token'));
		let request;

		setIsLoading(true);
		setError(null);

		if(requestConfig.method === 'post'){
			request = api.post(requestConfig.url, requestConfig.params);
		}else if(requestConfig.method === 'patch'){
			request = api.patch(requestConfig.url, requestConfig.params);
		}else if(requestConfig.method === 'delete'){
			request = api.delete(requestConfig.url, requestConfig.params);
		}else{
			request = api.get(requestConfig.url);
		}

		request.then((resp)=>{
			callBack(resp.data.data);
		}).catch((err)=>{
			if (err.response) {
				let errResponseData = err.response.data;
				// client received an error response (5xx, 4xx)
				if(!errResponseData.success) {
					setError(errResponseData.message);
				} else if(errResponseData.message.length > 0) {
					setError(errResponseData.message);
				} else {
					setError(err.response.statusText + '. Contact administrator.');
				}
			} else if (err.request) {
				// client never received a response, or request never left
				setError('Failed to fetch pre-requisites. Not able to send the request. Contact administrator.');
			} else {
				setError('Failed to fetch pre-requisites. Some error occurred. Contact administrator.');
			}
		}).then(()=>{
			setIsLoading(false);
		});
	},[]);

	return {isLoading, apiRequest, error};
}

export default useApi;