"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventChangeArg, EventClickArg } from "@fullcalendar/core/index.js";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { useModal } from "@/hooks/use-modal";
import { Id } from "@/convex/_generated/dataModel";

import { Header } from "./header";

interface CalendarProps {
  orgId: string;
}

type CustomEvent = {
  id: Id<"events">;
  title: string;
  orgId: string;
  start: number;
  description?: string;
  allDay: boolean;
  _creationTime: number;
};

export const Calendar = ({ orgId }: CalendarProps) => {
  const modal = useModal((state) => state);

  const events = useQuery(api.events.getAll, { orgId });
  const update = useMutation(api.events.update);

  const [mappedEvents, setMappedEvents] = useState<CustomEvent[]>([]);

  const handleDateClick = (data: { date: Date; allDay: boolean }) => {
    console.log(data.date);

    modal.onOpen("createEvent", {
      start: data.date,
      allDay: data.allDay,
      orgId,
    });
  };

  const handleEventChange = (args: EventChangeArg) => {
    const promise = update({
      id: args.event.id as Id<"events">,
      title: args.event.title,
      start: args.event.start?.getTime() as number,
    });

    toast.promise(promise, {
      loading: "Moving event...",
      success: "Event moved!",
      error: "Failed to move event.",
    });
  };

  const handleEventClick = (args: EventClickArg) => {
    const event = events?.find((event) => event._id === args.event.id);

    modal.onOpen("eventInfo", { event });
  };

  useEffect(() => {
    const mapEvents = () => {
      if (!events) {
        return;
      }

      const mappedEvents = events?.map((event) => {
        const { _id, ...rest } = event;

        return { id: _id, ...rest };
      });

      setMappedEvents(mappedEvents);
    };

    mapEvents();
  }, [events]);

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
                events={mappedEvents}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                dateClick={handleDateClick}
                drop={() => {}}
                eventClick={handleEventClick}
                eventChange={handleEventChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
