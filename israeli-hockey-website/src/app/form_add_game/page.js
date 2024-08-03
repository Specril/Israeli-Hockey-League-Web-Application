

import React from 'react';
import FormComponent from './FormComponent';
import 'antd/dist/reset.css'; // Import Ant Design CSS reset
import ProtectedPage from "../ProtectedPage/ProtectedPage";




export default async function AddGameForm() {


  return (
    <ProtectedPage content={
      <FormComponent />

    }
      allowed_user_types={["admin"]}
    />
  );
}