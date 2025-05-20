import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { MapPin, Bus, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@heroui/button";
import React from "react";
import marriottLogo from "../assets/images/logos/marriott.png";
import holidayInnLogo from "../assets/images/logos/holiday.png";
import hiltonLogo from "../assets/images/logos/hilton.png";
import bestWesternLogo from "../assets/images/logos/bestwestern.jpg";
import comfortInnLogo from "../assets/images/logos/comfort.jpg";

export default function TravelPage() {
  // Hotel data
  /*
      roomBlockCode: null, --> No room block, otherwise room block code
      shuttleService: false, --> No shuttle service, or true for shuttle service
  */
  const hotels = [
    {
      name: "Marriott",
      image: "/api/placeholder/400/250",
      address: "1234 Main Street, Lake George, NY",
      roomBlockCode: "ROGOFFWEDDING123",
      shuttleService: true,
      website: "https://www.marriott.com",
      bookByDate: "September 15, 2025",
    },
    {
      name: "Holiday Inn",
      image: "/api/placeholder/400/250",
      address: "5678 Lakeview Road, Lake George, NY",
      roomBlockCode: null,
      shuttleService: false,
      website: "https://www.holidayinn.com",
      bookByDate: null,
    },
    {
      name: "Hilton",
      image: "/api/placeholder/400/250",
      address: "9101 Mountain Drive, Lake George, NY",
      roomBlockCode: "HILTONWEDDING456",
      shuttleService: true,
      website: "https://www.hilton.com",
      bookByDate: "September 15, 2025",
    },
    {
      name: "Best Western",
      image: "/api/placeholder/400/250",
      address: "2222 Sunset Blvd, Lake George, NY",
      roomBlockCode: null,
      shuttleService: false,
      website: "https://www.bestwestern.com",
      bookByDate: null,
    },
    {
      name: "Comfort Inn",
      image: "/api/placeholder/400/250",
      address: "3333 Sunrise Ave, Lake George, NY",
      roomBlockCode: "COMFORTWEDDING789",
      shuttleService: true,
      website: "https://www.comfortinn.com",
      bookByDate: "September 10, 2025",
    },
    {
      name: "Comfort Inn1",
      image: "/api/placeholder/400/250",
      address: "3333 Sunrise Ave, Lake George, NY",
      roomBlockCode: null,
      shuttleService: true,
      website: "https://www.comfortinn.com",
      bookByDate: "September 10, 2025",
    },
  ];

  // Filter out duplicate hotels (based on name and address combination)
  const uniqueHotels = hotels.filter(
    (hotel, index, self) =>
      index ===
      self.findIndex(
        (h) => h.name === hotel.name && h.address === hotel.address
      )
  );

  // Separate hotels with room blocks
  const roomBlockHotels = uniqueHotels.filter((hotel) => hotel.roomBlockCode);
  const otherHotels = uniqueHotels.filter((hotel) => !hotel.roomBlockCode);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-start gap-6 py-8 md:py-10 px-4 md:px-6 w-full max-w-7xl mx-auto">
        <div className="w-full text-center mb-6">
          <h1 className={`${title()} relative inline-block`}>
            <span
              className="relative z-10"
              style={{
                fontFamily: "'Pinyon Script', 'Dancing Script', cursive",
              }}
            >
              Travel & Accommodations
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-rose-200 -z-10 transform -rotate-1"></span>
          </h1>

          <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-md text-left">
            <p className="text-amber-800 font-medium text-lg">Important Note</p>
            <p className="text-gray-700">
              Our wedding is during Columbus Day Weekend (October 9-11, 2026).
              Please book your accommodations early as this is a popular weekend
              in Lake George!
            </p>
          </div>
        </div>

        {/* Room Block Hotels Section */}
        <div className="w-full mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Recommended Hotels
            </h2>
          </div>

          <p className="text-gray-700 mb-6">
            We've reserved room blocks at these hotels for our wedding guests.
            Please mention our room block code when booking to receive special
            rates. A shuttle service will be provided to and from the wedding
            venue for guests staying at these hotels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomBlockHotels.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        </div>

        {/* Other Hotels Section */}
        <div className="w-full mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Additional Accommodations
          </h2>
          <p className="text-gray-700 mb-6">
            These hotels are also available in the area. Please note that room
            blocks and shuttle services are not available for these
            accommodations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherHotels.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        </div>

        {/* Transportation Section */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Transportation
          </h2>

          <div className="flex items-start space-x-3 mb-4">
            <Bus className="text-rose-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800 text-lg">
                Wedding Shuttle Service
              </h3>
              <p className="text-gray-600">
                Complimentary shuttle service will be provided between hotels
                with room blocks and the wedding venue. The shuttle schedule
                will be provided closer to the wedding date.
              </p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}

// Hotel Card Component
type Hotel = {
  name: string;
  image: string;
  address: string;
  roomBlockCode: string | null;
  shuttleService: boolean;
  website: string;
  bookByDate: string | null;
};

const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
  const hotelLogos: Record<string, string> = {
    Marriott: marriottLogo,
    "Holiday Inn": holidayInnLogo,
    Hilton: hiltonLogo,
    "Best Western": bestWesternLogo,
    "Comfort Inn": comfortInnLogo,
    "Comfort Inn1": comfortInnLogo,
  };
  const logo = hotelLogos[hotel.name] || "/api/placeholder/64/64";

  return (
    <div className="flex flex-col h-full rounded-lg shadow-md overflow-hidden bg-white transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 pb-4">
      <div className="p-4 flex flex-row items-center">
        <img
          src={logo}
          alt={`${hotel.name} Logo`}
          className="w-12 h-12 rounded-full object-cover mr-3 border border-gray-200 bg-white"
        />
        <h4 className="text-lg font-medium text-black">{hotel.name}</h4>
      </div>
      <div className="px-4 flex flex-col flex-grow">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-gray-700 mb-2 underline hover:text-black transition-colors"
          aria-label={`Open ${hotel.name} address in Google Maps`}
        >
          <MapPin size={16} className="mr-1 flex-shrink-0 mt-1" />
          {hotel.address}
        </a>

        {hotel.roomBlockCode && (
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <p className="text-sm font-medium text-gray-700">
              Room Block Code:
            </p>
            <p className="text-lg font-mono tracking-wide">
              {hotel.roomBlockCode}
            </p>
            {hotel.bookByDate && (
              <div className="flex items-center text-xs text-amber-700 mt-1">
                <Calendar size={14} className="mr-1" />
                <span>Book by {hotel.bookByDate}</span>
              </div>
            )}
          </div>
        )}

        {hotel.shuttleService ? (
          <div className="flex items-center text-green-700 text-sm mb-4">
            <Bus size={16} className="mr-2" />
            <span>Shuttle Service Available</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <Bus size={16} className="mr-2" />
            <span>No Shuttle Service</span>
          </div>
        )}

        <Button
          className="mt-auto"
          variant="solid"
          onClick={() =>
            window.open(hotel.website, "_blank", "noopener,noreferrer")
          }
          aria-label={`Book at ${hotel.name}`}
        >
          <span className="inline-flex items-center gap-2">
            Book Now
            <ExternalLink size={16} />
          </span>
        </Button>
      </div>
    </div>
  );
};
