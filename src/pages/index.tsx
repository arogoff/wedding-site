import { Link } from "@heroui/link";
import { Calendar } from "@heroui/calendar";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { Button, ButtonGroup } from "@heroui/button";

function addDays(date: any, days: number) {
  const result = new Date(date.year, date.month - 1, date.day);
  result.setDate(result.getDate() + days);
  return parseDate(`${result.getFullYear()}-${(result.getMonth() + 1).toString().padStart(2, '0')}-${result.getDate().toString().padStart(2, '0')}`);
}

import React from "react";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const [value, setValue] = React.useState(parseDate("2026-10-08"));
  const [minValue] = React.useState(parseDate("2026-10-08"));
  const [maxValue] = React.useState(parseDate("2026-10-11"));

  const events: Record<
    string,
    { title: string; time: string; location: string; description?: string; rsvp?: boolean }[]
  > = {
    "2026-10-08": [
      {
        title: "Welcome Party",
        time: "6:00 PM",
        location: "The Erlowest, Lake George, NY",
        description: "Join us for a casual welcome party to kick off the celebrations!",
        rsvp: true,
      },
    ],
    "2026-10-09": [
      {
        title: "Wedding Ceremony",
        time: "4:00 PM",
        location: "The Erlowest, Lake George, NY",
        description: "The main event! Witness the union of Daniel and Kendall.",
      },
      {
        title: "Reception",
        time: "6:00 PM",
        location: "The Erlowest, Lake George, NY",
        description: "Celebrate with us at the reception with dinner and dancing.",
        rsvp: true,
      },
    ],
    "2026-10-10": [
      {
        title: "Farewell Brunch",
        time: "10:00 AM",
        location: "The Erlowest, Lake George, NY",
        description: "Say goodbye and enjoy a relaxing brunch before heading home.",
      },
    ],
  };

  const handleNextDay = () => {
    const nextDay = addDays(value, 1);
    if (nextDay.compare(maxValue) <= 0) {
      setValue(nextDay);
    }
  };

  const handlePreviousDay = () => {
    const previousDay = addDays(value, -1);
    if (previousDay.compare(minValue) >= 0) {
      setValue(previousDay);
    }
  };

  const handleRSVP = (eventTitle: string) => {
    alert(`RSVP for "${eventTitle}" has been clicked!`);
  };

  const selectedDate: string = value.toString();
  const dayEvents = events[selectedDate] || [
    {
      title: "No events scheduled",
      time: "",
      location: "",
    },
  ];

  const formattedDate = new Date(value.year, value.month - 1, value.day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DefaultLayout>
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-8 gap-4 h-[60vh]">
          <div className="flex flex-col items-start justify-center bg-gray-100 p-6 rounded-lg w-full md:w-1/2 h-full">
            <p className="text-4xl font-bold">Daniel Raffaelli</p>
            <p className="text-2xl">&</p>
            <p className="text-4xl font-bold">Kendall Rogoff</p>
          </div>

          <div
            className="relative flex flex-col items-end justify-center text-right p-6 rounded-lg w-full md:w-1/2 h-full"
            style={{
              backgroundImage: `
                url('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fbf%2F4b%2Fc2%2Fbf4bc208f9f67c444206dd23eb06c2f4.jpg&f=1&nofb=1&ipt=5c58c0e2babe548df766a3825cc08eeb2dd7b9d042714475e6c94593f53efc6d')
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>

            {/* Text content */}
            <div className="relative z-10">
              <p className="text-3xl font-semibold text-white">October 9th, 2026</p>
              <p className="text-xl text-white">at</p>
              <p className="text-3xl font-semibold text-white">The Erlowest, Lake George, NY</p>
            </div>
          </div>
        </div>

        {/* Weekend at a Glance Section */}
        <div className="w-full px-4 md:px-8 mt-8">
          <h2 className="text-3xl font-bold text-left mb-6">Weekend at a Glance</h2> {/* Left-aligned text */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Calendar and Divider */}
            <div className="flex flex-row items-start gap-4">
              {/* Calendar on the left */}
              <div className="flex-shrink-0 w-96 h-[30rem] flex items-start justify-center">
                <Calendar
                  aria-label="Calendar"
                  value={value}
                  onChange={setValue}
                  minValue={minValue}
                  maxValue={maxValue}
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-300 h-[30rem]"></div>
            </div>

            {/* Event details on the right */}
            <div className="flex-grow h-[30rem] overflow-y-auto p-4">
              <h4 className="text-2xl font-semibold mb-4">{formattedDate}</h4>
              {dayEvents.map((event, index) => (
                <div key={index} className="mb-6">
                  <p className="text-xl font-bold">{event.title}</p>
                  <p className="text-lg">{event.time}</p>
                  <p className="text-lg">{event.location}</p>
                  {event.description && <p className="text-md text-gray-600 mt-2">{event.description}</p>}
                  {event.rsvp && (
                    <Button
                      className="mt-4"
                      variant="solid"
                      onPress={() => handleRSVP(event.title)}
                    >
                      RSVP
                    </Button>
                  )}
                </div>
              ))}

              {/* Navigation buttons */}
              <div
                className={`flex mt-4 ${
                  value.compare(minValue) > 0 ? "justify-between" : "justify-end"
                }`}
              >
                {value.compare(minValue) > 0 && (
                  <Button
                    variant="solid"
                    onPress={handlePreviousDay}
                  >
                    Previous Day
                  </Button>
                )}
                {value.compare(maxValue) < 0 && (
                  <Button
                    variant="solid"
                    onPress={handleNextDay}
                  >
                    Next Day
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
