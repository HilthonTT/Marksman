"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { useModal } from "@/hooks/use-modal";

import { Header } from "./header";

interface CalendarProps {
  orgId: string;
}

export const Calendar = ({ orgId }: CalendarProps) => {
  const modal = useModal((state) => state);

  const events = useQuery(api.events.getAll, { orgId });

  const handleDateClick = () => {
    modal.onOpen("createEvent");
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-between p-24 pt-4 w-full text-black">
        <div className="w-full">
          <div className="grid grid-cols-12 h-full">
            <div className="col-span-12">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                headerToolbar={{
                  left: "prev, next today",
                  center: "title",
                  right: "resourceTimelineWook, dayGridMonth, timeGridWeek",
                }}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                dateClick={handleDateClick}
                drop={(data) => {}}
                eventClick={(data) => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
