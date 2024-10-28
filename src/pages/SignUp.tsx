import React from "react";
import SignUpForm from "../components/SignUpForm";
import { Helmet } from "react-helmet-async";

function SignUp() {
  //after a successfull signup decide if it navigates to sign in or another page
  //with success and allows the user to click link to sign in?
  return (
    <div className="mt-4">
      <Helmet>
        <title>Cyber Den Sign-Up</title>
      </Helmet>
      <SignUpForm></SignUpForm>
      <div className="h-[300px]"></div>
    </div>
  );
}

export default SignUp;
