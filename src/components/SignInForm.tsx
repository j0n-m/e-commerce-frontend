import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
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
import useAuth from "../hooks/useAuth";

function SignInForm() {
  const [errorMessage, setErrorMessage] = useState<
    undefined | { email?: string; password?: string }
  >(undefined);
  const [password, setPassword] = useState("");
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const [locationFrom, setLocationFrom] = useState<string | undefined>();

  const signInMutate = useMutation({
    mutationKey: ["signin"],
    mutationFn: async (formData: { email: string; password: string }) => {
      return await fetch.post(
        "auth/login",
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        { withCredentials: true }
      );
    },
    onSuccess: async (data) => {
      setUser(data.data.user);
    },
    onError: (error) => {
      const errorResponse = (error as AxiosError)?.response;
      const errorObj = errorResponse?.data;

      if (errorResponse!.status > 401) {
        setGlobalError(
          "An error occured while trying to login. Please try again later."
        );
        return;
      } else {
        if (errorObj) {
          setErrorMessage(errorObj);
        }
      }
      setPassword("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const validateForm = (signInFormData: {
      email: string;
      password: string;
    }) => {
      const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "gm"
      );
      const isValidEmail = emailRegex.test(signInFormData.email);
      if (!isValidEmail) {
        setErrorMessage({
          email:
            "Email is in an invalid format. Must include an '@` and a domain name. Example: email@mail.com",
        });
        return false;
      }
      return true;
    };
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
      password: string;
    };
    const isFormValid = validateForm(formData);
    if (!isFormValid) return;
    signInMutate.mutate(formData);
  };

  useEffect(() => {
    if (typeof locationFrom === "undefined") {
      setLocationFrom(location?.search?.from || "");
    }
    if (signInMutate.isSuccess && user) {
      const run = async () => {
        setPassword("");
        // await queryClient.invalidateQueries({ queryKey: ["auth"] });
        console.log("Successful sign in");

        await navigate({ to: locationFrom ?? "/", replace: true });
      };
      run();
    }
  }, [user, signInMutate.isSuccess]);
  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 max-w-[400px] lg:max-w-[500px] mx-auto"
        validationErrors={
          typeof errorMessage === "undefined" ? undefined : errorMessage
        }
      >
        <span className="logo text-center text-3xl uppercase items-stretch tracking-wider">
          Cyber Den
        </span>
        <h2 className="font-bold pt-2 text-2xl">Sign In</h2>
        <TextField
          name="email"
          className={"flex flex-col gap-1"}
          type="email"
          isRequired
        >
          <Label>Email</Label>
          <Input
            className={() =>
              `p-2 border border-neutral-400 rounded-sm dark:bg-slate-800 dark:border-slate-700`
            }
            onChange={() => {
              if (globalError) {
                setGlobalError("");
              }
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
          <Label>Password</Label>
          <Input
            value={password}
            minLength={5}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (globalError) {
                setGlobalError("");
              }
              setPassword(e.target.value);
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
          className={({ isHovered, isFocusVisible, isDisabled }) =>
            `text-black px-3 py-2 rounded-sm text-lg ${isHovered || isFocusVisible ? "bg-[#ff841f]" : isDisabled ? "bg-gray-400" : "bg-orange-400"}`
          }
          isDisabled={signInMutate.isPending}
        >
          Sign in
        </Button>
        <Button
          type="button"
          onPress={() =>
            signInMutate.mutate({
              email: "dirt@mail.com",
              password: "12345",
            })
          }
          className={({ isHovered, isFocusVisible, isDisabled }) =>
            `text-black px-3 py-2 rounded-sm text-lg ${isHovered || isFocusVisible ? "bg-[#ff841f]" : isDisabled ? "bg-gray-400" : "bg-orange-400"}`
          }
          isDisabled={signInMutate.isPending}
        >
          Sign in as test user
        </Button>
      </Form>
      <p className="text-center mt-1">
        <span>New user? </span>
        <Link to="/signup">
          <span className="font-bold underline underline-offset-2 hover:text-blue-500">
            Create an account
          </span>
        </Link>
      </p>
    </div>
  );
}

export default SignInForm;
