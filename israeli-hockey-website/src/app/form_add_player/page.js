

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import ProtectedPage from "../ProtectedPage/ProtectedPage";



export default async function Page() {


  return (
    <ProtectedPage content={
      <FormComponent />

    }
      allowed_user_types={["coach", "admin"]}
    />
  );
}