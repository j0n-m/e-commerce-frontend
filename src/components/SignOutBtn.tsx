import { useMutation } from "@tanstack/react-query";
import React, { forwardRef, useImperativeHandle } from "react";
import fetch from "../utilities/fetch";
import { useNavigate } from "@tanstack/react-router";
import { Button, ButtonRenderProps } from "react-aria-components";

export type SignOutBtnProps = {
  className:
    | string
    | ((
        values: ButtonRenderProps & {
          defaultClassName: string | undefined;
        }
      ) => string)
    | undefined;
  text?: string;
  // refs?: React.LegacyRef<HTMLButtonElement> | undefined;
};
export interface LogoutRef {
  handleSignOut: () => void;
}
//(props: ButtonProps & React.RefAttributes<HTMLButtonElement>) => React.ReactElement | null
const SignOutBtn = forwardRef<LogoutRef, SignOutBtnProps>(
  ({ className = "", text = "Sign out" }: SignOutBtnProps, ref) => {
    const navigate = useNavigate();
    const mutate = useMutation({
      mutationFn: async () =>
        await fetch.post("auth/logout", {}, { withCredentials: true }),
      onSuccess: async () => {
        //as long as navigating to each route resets "auth" query, no need to manually invalidate here
        // await queryClient.invalidateQueries({ queryKey: ["auth"] });
        await navigate({ to: "/", replace: true });
      },
    });
    const handleSignOut = () => {
      mutate.mutate();
    };

    useImperativeHandle(ref, () => ({
      handleSignOut,
    }));

    return (
      // <button className={className} onClick={handleSignOut}>
      //   {text}
      // </button>
      <Button className={className} onPress={handleSignOut}>
        {text}
      </Button>
    );
  }
);

export default SignOutBtn;
