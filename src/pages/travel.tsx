import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import React from "react";

export default function TravelPage() {
  const hotels = [
    {
      name: "Marriott",
      address: "1234 Main Street, Lake George, NY",
      roomBlockCode: "ROGOFFWEDDING123",
      shuttleService: true,
      website: "https://www.marriott.com",
    },
    {
      name: "Holiday Inn",
      address: "5678 Lakeview Road, Lake George, NY",
      roomBlockCode: null, // No room block
      shuttleService: false, // No shuttle service
      website: "https://www.holidayinn.com",
    },
    {
      name: "Hilton",
      address: "9101 Mountain Drive, Lake George, NY",
      roomBlockCode: "HILTONWEDDING456",
      shuttleService: true,
      website: "https://www.hilton.com",
    },
    {
      name: "Best Western",
      address: "2222 Sunset Blvd, Lake George, NY",
      roomBlockCode: null,
      shuttleService: false,
      website: "https://www.bestwestern.com",
    },
    {
      name: "Comfort Inn",
      address: "3333 Sunrise Ave, Lake George, NY",
      roomBlockCode: "COMFORTWEDDING789",
      shuttleService: true,
      website: "https://www.comfortinn.com",
    },
    {
        name: "Holiday Inn",
        address: "5678 Lakeview Road, Lake George, NY",
        roomBlockCode: null, // No room block
        shuttleService: false, // No shuttle service
        website: "https://www.holidayinn.com",
      },
      {
        name: "Hilton",
        address: "9101 Mountain Drive, Lake George, NY",
        roomBlockCode: "HILTONWEDDING456",
        shuttleService: true,
        website: "https://www.hilton.com",
      },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const hotelsPerPage = 3; // # of hotels visible per page

  const handleNext = () => {
    if (currentIndex + hotelsPerPage < hotels.length) {
      setCurrentIndex(currentIndex + hotelsPerPage);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - hotelsPerPage);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-start gap-6 py-8 md:py-10 px-4 md:px-8">
        <h1 className={`${title()} text-left`}>Travel</h1>
        <p className="text-gray-600">
          Reminder: The wedding is during Columbus Weekend, please book your hotels early to ensure you have space!
        </p>

        <h3 className="text-xl font-semibold">Hotels</h3>
        <div className="relative w-full max-w-7xl overflow-hidden">
          {/* Hotel Carousel */}
          <div
            className="flex transition-transform duration-500 gap-6"
            style={{
              transform: `translateX(-${(currentIndex / hotelsPerPage) * 100}%)`,
            }}
          >
            {hotels.map((hotel, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{
                  flexBasis: `${100 / hotelsPerPage}%`,
                  maxWidth: `${(100 / hotelsPerPage) - 2}%`,
                }}
              >
                <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col gap-4 min-h-[300px]">
                  <p className="text-2xl font-bold text-gray-800">{hotel.name}</p>
                  <p className="text-lg text-gray-600">{hotel.address}</p>
                  {hotel.roomBlockCode && (
                    <p className="text-md text-gray-500">
                      <strong>Room Block Code:</strong> {hotel.roomBlockCode}
                    </p>
                  )}
                  {hotel.shuttleService ? (
                    <p className="text-md text-green-600 font-medium">Shuttle Service Provided</p>
                  ) : (
                    <p className="text-md text-red-600 font-medium">No Shuttle Service</p>
                  )}
                  <Button
                    variant="solid"
                    className="mt-auto"
                    onPress={() => window.open(hotel.website, "_blank")}
                  >
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow Buttons */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            &#8592; {/* Left Arrow */}
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md"
            onClick={handleNext}
            disabled={currentIndex + hotelsPerPage >= hotels.length}
          >
            &#8594; {/* Right Arrow */}
          </button>

          {/* Dots for Navigation */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: Math.ceil(hotels.length / hotelsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  currentIndex / hotelsPerPage === index ? "bg-gray-800" : "bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index * hotelsPerPage)}
              />
            ))}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
