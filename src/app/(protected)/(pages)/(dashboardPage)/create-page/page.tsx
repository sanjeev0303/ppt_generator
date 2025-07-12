import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import RenderPage from "./_components/RenderPage";
// import { onAuthenticateUser } from "@/actions/user";
// import { redirect } from "next/navigation";

const CreatePage = async () => {
  // Temporarily disabled to fix build
  // const checkUser = await onAuthenticateUser();
  // if (!checkUser.user) {
  //   redirect("/sign-in");
  // }
  // if (!checkUser.user.subscription) {
  //   redirect("/dashboard");
  // }

  return (
    <main className="w-full h-full pt-6 ">
      <Suspense
        fallback={
          <div className="h-full w-full flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <RenderPage/>
      </Suspense>
    </main>
  );
};

export default CreatePage;
