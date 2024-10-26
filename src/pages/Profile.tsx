import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { queryClient } from "../App";
import { AxiosError, AxiosResponse } from "axios";
import { UserAuth } from "../context/AuthContext";
import LoadingComponent from "../components/LoadingComponent";
import { useNavigate } from "@tanstack/react-router";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { trimString } from "../utilities/trimString";
import { useMutation } from "@tanstack/react-query";
import fetch from "../utilities/fetch";
import upperFirstLetters from "../utilities/upperFirstLetters";
import { Alert } from "@mui/material";

type ErrorData = {
  error: Error[];
};

type Error = {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
};
function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showUsernameEdit, setShowUsernameEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [errors, setErrors] = useState<undefined | { [index: string]: string }>(
    undefined
  );
  const userCache = (queryClient.getQueryData(["auth"]) as AxiosResponse).data
    ?.user as UserAuth;
  const userInfo = user ? user : userCache;
  const name = userInfo?.first_name + " " + userInfo?.last_name;
  const [newName, setNewName] = useState(upperFirstLetters(name) || "");
  const [newUsername, setNewUsername] = useState(`${userInfo?.username}` || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const nameMutate = useMutation({
    mutationFn: async (payload: { first_name: string; last_name: string }) => {
      return await fetch.put(
        `/api/customer/${userInfo?.id}`,
        {
          first_name: payload.first_name,
          last_name: payload.last_name,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      if (user) {
        setUser({
          ...user,
          first_name: payload.first_name,
          last_name: payload.last_name,
        });
      }
      setShowNameEdit(false);
      setSnackBarMessage("Successfully changed name");
      setShowSnackBar(true);
    },
    onError: (error) => {
      const response = error as AxiosError;
      const errorData = response?.response?.data;
      const message = (errorData as ErrorData).error[0]?.msg || error.message;
      setErrors({ name: message });
      message;
    },
  });
  const usernameMutate = useMutation({
    mutationFn: async (payload: { username: string }) => {
      return await fetch.put(
        `/api/customer/${userInfo?.id}`,
        {
          username: payload.username,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      if (user) {
        setUser({
          ...user,
          username: payload.username,
        });
      }
      setNewUsername("");
      setShowUsernameEdit(false);
      setSnackBarMessage("Successfully changed username");
      setShowSnackBar(true);
    },
    onError: (error) => {
      const response = error as AxiosError;
      const errorData = response?.response?.data;
      const message = (errorData as ErrorData).error[0]?.msg || error.message;
      setErrors({ username: message });
    },
  });
  const passwordMutate = useMutation({
    mutationFn: async (payload: { password: string }) => {
      return await fetch.put(
        `/api/customer/${userInfo?.id}`,
        {
          password: payload.password,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      setShowPasswordEdit(false);
      setSnackBarMessage("Successfully changed password");
      setShowSnackBar(true);
    },
    onError: (error) => {
      const response = error as AxiosError;
      const errorData = response?.response?.data;
      const message = (errorData as ErrorData).error[0]?.msg || error.message;
      setErrors({ newpassword: message });
    },
  });

  const handleNameFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ("test");
    const name = newName.trim().split(" ");

    const [first, ...last] = name;
    const firstName = first;
    const lastName = last.join(" ");

    const combinedName = `${firstName} ${lastName}`;
    const oldName = upperFirstLetters(
      `${userInfo?.first_name} ${userInfo?.last_name}`
    );
    if (combinedName === oldName) {
      setShowNameEdit(false);
      return;
    }
    // (combinedName, oldName);
    nameMutate.mutate({ first_name: firstName, last_name: lastName });
  };

  const handleUsernameFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = newUsername.trim();
    usernameMutate.mutate({ username: username });
  };
  const handlePasswordFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const isOldPassVerified = async () => {
      try {
        const response = await fetch.post(
          "/auth/login",
          { email: userInfo?.email, password: oldPassword },
          { withCredentials: true }
        );
        if (response.status >= 200 || response.status <= 299) {
          return true;
        } else {
          setOldPassword("");
          setErrors({ password: "Failed to verify your old password." });
          return false;
        }
      } catch (error) {
        setOldPassword("");
        setErrors({ password: "Your old password is incorrect." });
        return false;
      }
    };
    const verifiedOldPass = await isOldPassVerified();
    if (verifiedOldPass) {
      const passwordsMatch = newPassword === confirmNewPassword;
      if (!passwordsMatch) {
        setNewPassword("");
        setConfirmNewPassword("");
        setErrors({ newpassword: "Passwords do not match. Please Try again." });
        return;
      }
      if (oldPassword === newPassword) {
        setErrors({
          password:
            "Your old password and new password are the same. Try another new password.",
        });
        setNewPassword("");
        setConfirmNewPassword("");
        return;
      }
      passwordMutate.mutate({ password: newPassword });
      setNewPassword("");
      setConfirmNewPassword("");
      setOldPassword("");
    }
  };
  const handleCloseSnackBar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackBar(false);
  };

  useEffect(() => {
    if (!userInfo) {
      navigate({ to: "/signin", search: { from: window.location.pathname } });
    }
  }, [user]);
  if (!userInfo) {
    return <LoadingComponent></LoadingComponent>;
  }

  if (showNameEdit) {
    return (
      <main className="flex-1 py-4 px-2 lg:px-4">
        <div className="max-w-[500px] mx-auto">
          <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
            Change your name
          </h1>
          <div className="inforounded-lg md:px-2">
            <Form
              validationErrors={errors}
              onSubmit={handleNameFormSubmit}
              className=""
            >
              <TextField
                name="name"
                type="text"
                isRequired={true}
                minLength={3}
                className={"flex flex-col gap-1"}
              >
                <Label>New Name</Label>
                <Input
                  autoFocus={true}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={
                    "dark:bg-a0sd border dark:border-[#555] p-2 rounded-md dark:border-2"
                  }
                />
                <FieldError className={"text-red-500"}></FieldError>
              </TextField>
              <div className="flex gap-3">
                <Button
                  isDisabled={nameMutate.isPending}
                  className={
                    "mt-2 bg-orange-400 min-h-[38px] text-black py-1 px-3 rounded-lg"
                  }
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  onPress={() => setShowNameEdit(false)}
                  className={({ isHovered, isPressed, isFocusVisible }) =>
                    `mt-2 dark:border-none border min-h-[38px] py-1 px-3 rounded-lg ${isHovered || isFocusVisible || isPressed ? "dark:bg-[#555]" : "dark:bg-a3sd"}`
                  }
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    );
  }
  if (showUsernameEdit) {
    return (
      <main className="flex-1 py-4 px-2 lg:px-4">
        <div className="max-w-[500px] mx-auto">
          <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
            Change your username
          </h1>
          <div className="inforounded-lg md:px-2">
            <Form
              validationErrors={errors}
              onSubmit={handleUsernameFormSubmit}
              className=""
            >
              <TextField
                name="username"
                type="text"
                isRequired={true}
                minLength={3}
                className={"flex flex-col gap-1"}
              >
                <Label>New Username</Label>
                <Input
                  autoFocus={true}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={
                    "dark:bg-a0sd border dark:border-[#555] p-2 rounded-md dark:border-2"
                  }
                />
                <FieldError className={"text-red-500"}></FieldError>
              </TextField>
              <div className="flex gap-3">
                <Button
                  isDisabled={usernameMutate.isPending}
                  className={
                    "mt-2 bg-orange-400 min-h-[38px] text-black py-1 px-3 rounded-lg"
                  }
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  onPress={() => setShowUsernameEdit(false)}
                  className={({ isHovered, isPressed, isFocusVisible }) =>
                    `mt-2 dark:border-none border min-h-[38px] py-1 px-3 rounded-lg ${isHovered || isFocusVisible || isPressed ? "dark:bg-[#555]" : "dark:bg-a3sd"}`
                  }
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    );
  }
  if (showPasswordEdit) {
    return (
      <main className="flex-1 py-4 px-2 lg:px-4">
        <div className="max-w-[500px] mx-auto">
          <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
            Change your Password
          </h1>
          <div className="inforounded-lg md:px-2">
            <Form
              validationErrors={errors}
              onSubmit={handlePasswordFormSubmit}
              className=""
            >
              <TextField
                name="password"
                type="password"
                isRequired={true}
                minLength={5}
                className={"flex flex-col gap-1"}
              >
                <Label>Old Password</Label>
                <Input
                  autoFocus={true}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={
                    "dark:bg-a0sd border dark:border-[#555] p-2 rounded-md dark:border-2"
                  }
                />
                <FieldError className={"text-red-500"}></FieldError>
              </TextField>
              <TextField
                name="newpassword"
                type="password"
                isRequired={true}
                minLength={5}
                className={"flex flex-col gap-1  mt-2"}
              >
                <Label>New Password</Label>
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={
                    "dark:bg-a0sd border dark:border-[#555] p-2 rounded-md dark:border-2"
                  }
                />
                <FieldError className={"text-red-500"}></FieldError>
              </TextField>
              <TextField
                name="confirmnewpasword"
                type="password"
                isRequired={true}
                minLength={5}
                className={"flex flex-col gap-1 mb-2 mt-2"}
              >
                <Label>Confirm new password</Label>
                <Input
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={
                    "dark:bg-a0sd border dark:border-[#555] p-2 rounded-md dark:border-2"
                  }
                />
                <FieldError className={"text-red-500"}></FieldError>
              </TextField>

              <div className="flex gap-3">
                <Button
                  isDisabled={passwordMutate.isPending}
                  className={
                    "mt-2 bg-orange-400 min-h-[38px] text-black py-1 px-3 rounded-lg"
                  }
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  onPress={() => setShowPasswordEdit(false)}
                  className={({ isHovered, isPressed, isFocusVisible }) =>
                    `mt-2 dark:border-none border min-h-[38px] py-1 px-3 rounded-lg ${isHovered || isFocusVisible || isPressed ? "dark:bg-[#555]" : "dark:bg-a3sd"}`
                  }
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 py-4 px-2 lg:px-4">
      <Snackbar
        open={showSnackBar}
        onClose={handleCloseSnackBar}
        autoHideDuration={3000}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          variant="filled"
          sx={{ fontSize: 16 }}
        >
          {snackBarMessage || "Success"}
        </Alert>
      </Snackbar>
      <div className="max-w-[700px] mx-auto">
        <h1 className="font-bold text-xl lg:text-2xl py-3 lg:py-5">
          Profile Settings
        </h1>
        <div className="content">
          <div className="info border dark:bg-a1sd dark:border-a3sd rounded-lg md:px-2">
            <div className="flex flex-col ">
              <div className="name-section p-2 flex-1">
                <div className="name flex justify-between">
                  <p className="flex flex-col">
                    <span className="dark:text-a1d">Name</span>
                    <span>{trimString(upperFirstLetters(name), 14)}</span>
                  </p>
                  <div className="flex items-center">
                    <Button
                      onPress={() => setShowNameEdit(!showNameEdit)}
                      className={({ isPressed, isHovered, isFocusVisible }) =>
                        `ml-2 px-4 py-1 rounded-full ${isHovered || isFocusVisible || isPressed ? "dark:bg-[#474747]" : "dark:bg-a3sd"}`
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
              <div className="username-section p-2 flex-1">
                <div className="username flex justify-between">
                  <p className="flex flex-col">
                    <span className="dark:text-a1d">Username </span>
                    <span>{trimString(userInfo.username, 14)}</span>
                  </p>
                  <div className="">
                    <Button
                      onPress={() => setShowUsernameEdit(!showUsernameEdit)}
                      className={({ isPressed, isHovered, isFocusVisible }) =>
                        `ml-2 px-4 py-1 rounded-full ${isHovered || isFocusVisible || isPressed ? "dark:bg-[#474747]" : "dark:bg-a3sd"}`
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
              <div className="email-section p-2 flex-1">
                <div className="email flex justify-between">
                  <p className="flex flex-col">
                    <span className="text-a1d">Email </span>
                    <span>{trimString(userInfo?.email, 20)}</span>
                  </p>
                </div>
              </div>
              <div className="password-section p-2 flex-1">
                <div className="password flex justify-between">
                  <p className="flex flex-col">
                    <span className="dark:text-a1d">Password </span>
                    <span>*******</span>
                  </p>
                  <div className="">
                    <Button
                      onPress={() => setShowPasswordEdit(true)}
                      className={({ isPressed, isHovered, isFocusVisible }) =>
                        `ml-2 px-4 py-1 rounded-full ${isHovered || isFocusVisible || isPressed ? "dark:bg-[#474747]" : "dark:bg-a3sd"}`
                      }
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;
