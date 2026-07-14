import React from 'react';



  export interface Application  {
  _id: String,
  name: String,
  email: String,
  message: String,
  status: String,
};

export  interface ApplicationResponse {
  applications: Application[] | null;
  error: string | null;
};