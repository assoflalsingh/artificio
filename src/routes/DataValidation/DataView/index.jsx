import React, { useState } from "react";
import DataViewForm from "./DataViewForm";
import DataViewList from "./DataViewList";

const DataView = () => {
	const [createDataView, setCreateDataView] = useState(false);
	const [formData, setFormData] = useState(null);

	return (<>
		{!createDataView && <DataViewList setFormData={setFormData} loadDataViewForm={setCreateDataView} />}
		{createDataView && <DataViewForm initFormData={formData} loadDataViewForm={setCreateDataView} />}
	</>);
}

export default DataView;