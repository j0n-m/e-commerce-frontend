import React from "react";
import SignUpForm from "../components/SignUpForm";

function SignUp() {
  //after a successfull signup decide if it navigates to sign in or another page
  //with success and allows the user to click link to sign in?
  return (
    <div className="mt-4">
      <SignUpForm></SignUpForm>
      <div className="h-[300px]"></div>
    </div>
  );
}

export default SignUp;
