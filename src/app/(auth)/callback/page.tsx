import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

const AuthCallbackPage = async () => {
  try {
    const auth = await onAuthenticateUser();
    if (auth.status === 200 || auth.status === 201) {
      redirect("/dashboard");
    } else {
      // Handle all other cases (400, 403, 500, or unexpected status codes)
      redirect("/sign-in");
    }
  } catch (error) {
    console.error("Authentication callback error:", error);
    redirect("/sign-in");
  }

  return null;
 };

export default AuthCallbackPage;
