import { PrimaryButton } from "@/components/Buttons";
import { useState } from "react";

interface ICalendarEvent {
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
}

const CalendarEventGenerator = () => {
  const [eventInfo, setEventInfo] = useState<ICalendarEvent>({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
    location: "",
  });

  const toLocalISO = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const formatDate = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d+/g, "");
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventInfo.title,
  )}&dates=${formatDate(eventInfo.start)}/${formatDate(
    eventInfo.end,
  )}&details=${encodeURIComponent(eventInfo.description)}&location=${encodeURIComponent(
    eventInfo.location,
  )}`;
  const addGoogleCalendarEventDisabled =
    eventInfo.title === "" || eventInfo.description === "";

  const handleAddEvent = () => {
    window.open(calendarUrl, "_blank");
  };
  return (
    <div className="flex flex-col gap-4">
      <h1>Calendar Event Generator</h1>
      <div className="labeled-input">
        <input
          type="text"
          id="title"
          placeholder=""
          value={eventInfo.title}
          onChange={(e) =>
            setEventInfo({ ...eventInfo, title: e.target.value })
          }
        />
        <label htmlFor="title">Title</label>
      </div>
      <div className="labeled-input">
        <input
          type="datetime-local"
          id="start"
          placeholder=""
          value={toLocalISO(eventInfo.start)}
          onChange={(e) =>
            setEventInfo({ ...eventInfo, start: new Date(e.target.value) })
          }
        />
        <label htmlFor="start">Start</label>
      </div>
      <div className="labeled-input">
        <input
          type="datetime-local"
          id="end"
          placeholder=""
          value={toLocalISO(eventInfo.end)}
          onChange={(e) =>
            setEventInfo({ ...eventInfo, end: new Date(e.target.value) })
          }
        />
        <label htmlFor="end">End</label>
      </div>
      <div className="labeled-input">
        <input
          type="text"
          id="location"
          placeholder=""
          value={eventInfo.location}
          onChange={(e) =>
            setEventInfo({ ...eventInfo, location: e.target.value })
          }
        />
        <label htmlFor="location">Location</label>
      </div>
      <div className="labeled-input">
        <textarea
          id="description"
          placeholder=""
          value={eventInfo.description}
          onChange={(e) =>
            setEventInfo({ ...eventInfo, description: e.target.value })
          }
        />
        <label htmlFor="description">Description</label>
      </div>
      <PrimaryButton
        onClick={handleAddEvent}
        disabled={addGoogleCalendarEventDisabled}
      >
        <div className="p-1 text-lg">Add Event</div>
      </PrimaryButton>
    </div>
  );
};

export default CalendarEventGenerator;
