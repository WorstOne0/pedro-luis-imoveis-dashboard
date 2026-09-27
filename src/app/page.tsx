// Next
import { redirect } from "next/navigation";

// AuthGuard sends anyone without a session on to the login screen.
export default function Home() {
  redirect("/dashboard");
}
