import React from "react";
import SignInForm from "../components/SignInForm";
import { Helmet } from "react-helmet-async";

function SignIn() {
  return (
    <div className="mt-4">
      <Helmet>
        <title>Cyber Den Sign-In</title>
      </Helmet>
      <SignInForm></SignInForm>
    </div>
  );
}

export default SignIn;
