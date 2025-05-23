import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@heroui/button";
import prospectMtnImg from "../assets/images/prospectmtn.jpg";
import buckMtnImg from "../assets/images/buckmtn.jpg";
import shelvingRockFallsImg from "../assets/images/shelvingrockfalls.jpg";
import fortwilliamhenryImg from "../assets/images/fortwilliamhenry.jpg";
import battlefieldparkImg from "../assets/images/battlefieldpark.jpg";
import adirondackwineryImg from "../assets/images/adirondackwinery.jpg";
import adirondackpubbreweryImg from "../assets/images/adirondackpubbrewery.jpg";
import boltonlandingbrewingImg from "../assets/images/boltonlandingbrewing.jpg";
import davidsonbrothersbreweryImg from "../assets/images/davidsonbrothersbrewery.jpg";
import lakegeorgehistoricalImg from "../assets/images/historicalassociation.jpg";
import ledgerockImg from "../assets/images/ledgerockhillwinery.jpg";
import springbrookhollowImg from "../assets/images/springbrookhollow.jpg";

type ActivityCardProps = {
  image: string;
  title: string;
  description: string;
  link: string;
  address: string;
};

const ActivityCard = ({
  image,
  title,
  description,
  link,
  address,
}: ActivityCardProps) => {
  return (
    <div className="flex flex-col h-full rounded-lg shadow-md overflow-hidden bg-white transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-lg font-medium text-black mb-1">{title}</h4>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-700 mb-2 inline-flex items-center underline hover:text-black transition-colors"
          aria-label={`Open ${title} address in Google Maps`}
        >
          <MapPin size={16} className="mr-1" />
          {address}
        </a>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <Button
          className="mt-auto"
          variant="solid"
          onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
          aria-label={`Learn more about ${title}`}
        >
          <span className="inline-flex items-center gap-2">
            Learn More
            <ExternalLink size={16} />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default function ThingsToDoPage() {
  const activities = {
    Hiking: [
      {
        image: prospectMtnImg,
        title: "Prospect Mountain",
        description:
          "Hike or drive to the summit for panoramic views of Lake George and the Adirondacks. A 3-mile round trip hike or shuttle available seasonally.",
        link: "https://www.tripadvisor.com/Attraction_Review-g48016-d116385-Reviews-Prospect_Mountain-Lake_George_New_York.html",
        address: "75 Smith St, Lake George, NY 12845",
      },
      {
        image: shelvingRockFallsImg,
        title: "Shelving Rock Falls",
        description:
          "Moderate 6.3-mile loop trail leading to a serene waterfall, ideal for all skill levels.",
        link: "https://www.lakegeorge.com/hiking/shelving-rock/",
        address: "Shelving Rock Rd, Fort Ann, NY 12827",
      },
      {
        image: buckMtnImg,
        title: "Buck Mountain",
        description:
          "A 6.6-mile round trip hike offering spectacular views of Lake George, especially vibrant with fall foliage.",
        link: "https://www.lakegeorge.com/hiking/buck-mountain/",
        address: "1750 Pilot Knob Rd, Kattskill Bay, NY 12844",
      },
    ],
    "Museums & Historical Sites": [
      {
        image: fortwilliamhenryImg,
        title: "Fort William Henry Museum",
        description:
          "Reconstructed 18th-century British fort with live demonstrations and guided tours.",
        link: "https://www.fwhmuseum.com/",
        address: "48 Canada St, Lake George, NY 12845",
      },
      {
        image: battlefieldparkImg,
        title: "Lake George Battlefield Park",
        description:
          "Site of the 1755 Battle of Lake George with monuments, fort remnants, and interpretive signs.",
        link: "https://lakegeorgebattlefield.org/",
        address: "Fort George Rd, Lake George, NY 12845",
      },
      {
        image: lakegeorgehistoricalImg,
        title: "Lake George Historical Association Museum",
        description:
          "Artifacts and exhibits housed in the historic 1845 courthouse.",
        link: "https://www.lakegeorgehistorical.org/",
        address: "290 Canada St, Lake George, NY 12845",
      },
    ],
    "Wineries & Distilleries": [
      {
        image: adirondackwineryImg,
        title: "Adirondack Winery",
        description:
          "Handcrafted wines with tastings available in Lake George Village. Reservations recommended.",
        link: "https://www.adirondackwinery.com/",
        address: "285 Canada St, Lake George, NY 12845",
      },
      {
        image: ledgerockImg,
        title: "Ledge Rock Hill Winery",
        description:
          "Family-owned winery with local wines like Strawberry Blanc. Tasting room in Lake George.",
        link: "https://lrhwinery.com/",
        address: "1776 US-9, Lake George, NY 12845",
      },
      {
        image: springbrookhollowImg,
        title: "Springbrook Hollow Farm Distillery",
        description:
          "Fort Ann-based distillery offering tastings of local vodka, gin, and moonshine.",
        link: "https://www.springbrookhollow.com/",
        address: "10047 NY-149, Fort Ann, NY 12827",
      },
    ],
    Breweries: [
      {
        image: adirondackpubbreweryImg,
        title: "Adirondack Pub & Brewery",
        description:
          "Crafting over 25 ales on-site, with tours and a rustic pub atmosphere in Lake George.",
        link: "https://www.adkbrewery.com",
        address: "33 Canada St, Lake George, NY 12845",
      },
      {
        image: boltonlandingbrewingImg,
        title: "Bolton Landing Brewing Company",
        description:
          "Local brewery in Bolton Landing offering house-made beers and hearty pub fare.",
        link: "https://www.boltonlandingbrewing.com/",
        address: "4933 Lake Shore Dr, Bolton Landing, NY 12814",
      },
      {
        image: davidsonbrothersbreweryImg,
        title: "Davidson Brothers Restaurant & Brewery",
        description:
          "Popular Glens Falls brewery with a full restaurant and wide beer selection.",
        link: "https://www.davidsonbrothers.com",
        address: "184 Glen St, Glens Falls, NY 12801",
      },
    ],
  };

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
              Things To Do
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-rose-200 -z-10 transform -rotate-1"></span>
          </h1>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Explore these wonderful activities and attractions during your stay
            for our wedding celebration. We've curated some of our favorite
            local spots for you to enjoy!
          </p>
        </div>

        {Object.entries(activities).map(([categoryName, categoryItems]) => (
          <div key={categoryName} className="w-full mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryItems.map((item, index) => (
                <ActivityCard
                  key={index}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  link={item.link}
                  address={item.address}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </DefaultLayout>
  );
}
