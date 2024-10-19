import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import fetch from "../utilities/fetch";
import { AxiosError } from "axios";
import validDomains from "../utilities/validDomains";

type IFormData = {
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  email: string;
  username: string;
};

function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState<
    undefined | Partial<IFormData>
  >(undefined);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [globalError, setGlobalError] = useState("");

  const signUpMutate = useMutation({
    mutationKey: ["signup"],
    mutationFn: async () => {
      return await fetch.post(
        "api/customers",
        {
          username,
          email,
          password,
          createdAt: new Date().toString(),
          first_name: firstName,
          last_name: lastName,
          shipping_address: null,
          order_history: null,
        },
        { withCredentials: true }
      );
    },
    onSuccess: async (data) => {
      console.log("success response", data);
    },
    onError: (error) => {
      //sets form errors returned by server
      const errorObj = (error as AxiosError)?.response;
      const errorData = errorObj?.data as {
        error?: string;
        single_error: { [index: string]: string };
      };
      console.log("bad response", errorObj);
      if (errorObj?.status === 400 && errorData?.single_error) {
        setErrorMessage(errorData.single_error);
      }
      if (errorObj!.status > 400 && errorObj!.status <= 500) {
        setGlobalError(
          errorData?.error ??
            "An error occured while creating your account. Please try again later."
        );
      }
      setPassword("");
      setConfirmPassword("");
    },
  });

  const validateForm = (): boolean => {
    if (password.length < 5) {
      setErrorMessage({
        password: "Password must be at least 5 characters long.",
      });
      setPassword("");
      setConfirmPassword("");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage({
        password: "Passwords do not match. Please try again.",
      });
      setPassword("");
      setConfirmPassword("");
      return false;
    }

    if (firstName.length < 2) {
      setErrorMessage({
        first_name: "First name must be at least 2 characters long.",
      });
      return false;
    }
    if (lastName.length < 1) {
      setErrorMessage({
        last_name: "Last name must be at least 1 character long.",
      });
      return false;
    }

    const emailRegex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "gm"
    );
    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      setErrorMessage({
        email:
          "Email is in an invalid format. Must include an '@` and a domain name.",
      });
      return false;
    }
    const emailArr = email.split(".");
    const domain = emailArr[emailArr.length - 1].toUpperCase();
    const isValidDomain = !!validDomains.get(domain);
    if (!isValidDomain) {
      setErrorMessage({
        email: `The email domain name, "${domain.toLowerCase()}", is invalid.`,
      });
      return false;
    }

    if (username.length < 3) {
      setErrorMessage({
        username: "Username must be at least 3 characters long.",
      });
      return false;
    }
    return true;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidForm = validateForm();

    if (!isValidForm) {
      console.log("Invalid form");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    // console.log("is form valid?", isValidForm);
    console.log("form is complete");
    signUpMutate.mutate();
  };
  if (signUpMutate.isSuccess) {
    return (
      <section className="max-w-[500px] mx-auto bg-white p-6 rounded-md dark:bg-slate-800">
        <h2 className="text-center text-2xl font-bold">
          Sucessfully created your account.
        </h2>
        <p className="text-center mt-4">
          <Link
            to="/signin"
            className={`text-purple-700 dark:text-purple-500 text-lg hover:underline focus-visible:underline underline-offset-4`}
          >
            Sign in here
          </Link>
        </p>
      </section>
    );
  }
  return (
    <div>
      <Form
        className="flex flex-col gap-4 p-4 mx-auto max-w-[400px] lg:max-w-[500px]"
        onSubmit={handleSubmit}
        validationErrors={
          typeof errorMessage === "undefined" ? undefined : errorMessage
        }
      >
        <span className="logo text-center text-3xl uppercase items-stretch tracking-wider">
          Cyber Den
        </span>
        <h2 className="font-bold pt-2 text-2xl text-start">
          Create an Account
        </h2>
        <div className="names-field lg:flex lg:gap-4 lg:items-start lg:justify-center relative">
          <TextField
            name="first_name"
            minLength={2}
            className={"flex flex-col gap-1 flex-1"}
            type="text"
            isRequired
          >
            <Label>
              First Name <span className="text-red-600">*</span>
            </Label>
            <Input
              className={() =>
                `p-2 border border-neutral-400 rounded-sm dark:bg-slate-800 dark:border-slate-700`
              }
              placeholder="Joe"
              value={firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (errorMessage?.first_name) {
                  setErrorMessage(undefined);
                }
                setFirstName(e.target.value.trim());
              }}
            />
            <FieldError className={`text-red-600`} />
          </TextField>

          <TextField
            name="last_name"
            className={"flex flex-col gap-1 flex-1"}
            type="text"
            minLength={1}
            isRequired
          >
            <Label>
              Last Name <span className="text-red-600">*</span>
            </Label>
            <Input
              className={() =>
                `p-2 border border-neutral-400 rounded-sm dark:bg-slate-800 dark:border-slate-700`
              }
              placeholder="Smith"
              value={lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (errorMessage?.last_name) {
                  setErrorMessage(undefined);
                }
                setLastName(e.target.value.trim());
              }}
            />
            <FieldError className={`text-red-600`} />
          </TextField>
        </div>

        <TextField
          name="email"
          className={"flex flex-col gap-1"}
          type="email"
          minLength={3}
          isRequired
          value={email}
          onChange={(e) => {
            if (errorMessage?.email) {
              setErrorMessage(undefined);
            }
            setEmail(e.trim());
          }}
        >
          <Label>
            Email <span className="text-red-600">*</span>
          </Label>
          <Input
            className={() =>
              `p-2 border border-neutral-400 rounded-sm dark:bg-slate-800 dark:border-slate-700`
            }
            placeholder="example@email.com"
          />
          <FieldError className={`text-red-600`} />
        </TextField>

        <TextField
          name="username"
          className={"flex flex-col gap-1"}
          type="text"
          isRequired
          minLength={3}
        >
          <Label>
            Username <span className="text-red-600">*</span>
          </Label>
          <Input
            className={() =>
              `p-2 border border-neutral-400 rounded-sm dark:bg-slate-800 dark:border-slate-700`
            }
            placeholder="j.smith"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (errorMessage?.username) {
                setErrorMessage(undefined);
              }
              setUsername(e.target.value.trim());
            }}
          />
          <FieldError className={`text-red-600`} />
        </TextField>

        <TextField
          name="password"
          className={"flex flex-col gap-1"}
          type="password"
          isRequired
        >
          <Label>
            Password <span className="text-red-600">*</span>
          </Label>
          <Input
            type="password"
            value={password}
            minLength={5}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (errorMessage?.password) {
                setErrorMessage(undefined);
              }
              setPassword(e.target.value.trim());
            }}
            className={() =>
              `p-2 border border-neutral-400 rounded-sm dark:bg-slate-800 dark:border-slate-700`
            }
          />
          <FieldError className={`text-red-600`} />
        </TextField>

        <TextField
          name="confirm_password"
          className={"flex flex-col gap-1"}
          type="password"
          isRequired
        >
          <Label>
            Confirm Password <span className="text-red-600">*</span>
          </Label>
          <Input
            value={confirmPassword}
            minLength={5}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (errorMessage?.confirm_password) {
                setErrorMessage(undefined);
              }
              setConfirmPassword(e.target.value.trim());
            }}
            className={() =>
              `p-2 border border-neutral-400 rounded-sm dark:bg-slate-800 dark:border-slate-700`
            }
          />
          <FieldError className={`text-red-600`} />
        </TextField>
        {globalError && (
          <p>
            <span className={`text-red-600`}>{globalError}</span>
          </p>
        )}

        <Button
          type="submit"
          isDisabled={
            signUpMutate.isPending || typeof errorMessage !== "undefined"
          }
          className={({ isHovered, isFocusVisible, isDisabled }) =>
            `text-black px-3 py-2 rounded-sm text-lg mt-2 ${isHovered || isFocusVisible ? "bg-[#ff841f]" : isDisabled ? "bg-gray-400" : "bg-orange-400"}`
          }
        >
          Sign Up
        </Button>
      </Form>
      <p className="text-center mt-1">
        <span>Already have an account? </span>
        <Link to="/signin">
          <span className="font-bold underline underline-offset-2 hover:text-blue-500">
            Sign in
          </span>
        </Link>
      </p>
    </div>
  );
}

export default SignUpForm;
