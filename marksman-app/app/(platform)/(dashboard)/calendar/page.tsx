import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Calendar } from "./_components/calendar";

const CalendarPage = () => {
  const { userId, orgId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  if (!orgId) {
    return redirect("/select-org");
  }

  return <Calendar orgId={orgId} />;
};

export default CalendarPage;
