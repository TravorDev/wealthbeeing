import { redirect } from "next/navigation"

export default function AddClientRedirectPage() {
  redirect("/clients/onboarding")
  return null
}

