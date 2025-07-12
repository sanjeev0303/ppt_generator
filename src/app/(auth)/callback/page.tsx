import { redirect } from "next/navigation";

const AuthCallbackPage = async () => {
  // Temporarily disabled to fix build
  // const auth = await onAuthenticateUser();
  // if (auth.status === 200 || auth.status === 201) {
    redirect("/dashboard");
  // } else {
  //   // Handle all other cases (400, 403, 500, or unexpected status codes)
  //   redirect("/sign-in");
  // }
};

export default AuthCallbackPage;
