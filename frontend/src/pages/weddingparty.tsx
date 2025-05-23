import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import defaultPersonImg from "../assets/images/people/default.jpg";

export default function WeddingPartyPage() {
  // Wedding party data
  const weddingPartyData = {
    bridesSide: [
      {
        id: 1,
        name: "First Last",
        role: "Maid of Honor",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 3,
        name: "First Last",
        role: "Bridesmaid",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 5,
        name: "First Last",
        role: "Bridesmaid",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 15,
        name: "First Last",
        role: "Bridesmaid",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 16,
        name: "First Last",
        role: "Bridesmaid",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
    ],
    groomsSide: [
      {
        id: 2,
        name: "First Last",
        role: "Best Man",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 4,
        name: "First Last",
        role: "Groomsman",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 6,
        name: "First Last",
        role: "Groomsman",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 10,
        name: "First Last",
        role: "Groomsman",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 11,
        name: "First Last",
        role: "Groomsman",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 12,
        name: "First Last",
        role: "Groomsman",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 13,
        name: "First Last",
        role: "Groomsman",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
    ],
    specialRoles: [
      {
        id: 7,
        name: "First Last",
        role: "Flower Girl",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
      {
        id: 8,
        name: "First Last",
        role: "Ring Bearer",
        image: defaultPersonImg,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ultricies lectus vel facilisis maximus. Donec nec mattis neque. Nunc hendrerit massa non dui mattis fermentum. Nunc vel ultricies orci, at tempor dolor.",
      },
    ],
  };

  // Render a section of wedding party members
  const renderPartySection = (
    title: string,
    members: Array<{
      id: number;
      name: string;
      role: string;
      image: string;
      description: string;
    }>,
    bgColor: string = "bg-rose-50"
  ) => (
    <div className="w-full mt-12 first:mt-6">
      <div className="relative mb-8">
        <h2
          className="text-3xl md:text-3xl font-semibold text-gray-800 text-center"
          style={{
            fontFamily: "'Pinyon Script', 'Dancing Script', cursive",
          }}
        >
          {title}
        </h2>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-rose-300"></div>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className={`${bgColor} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col w-full max-w-sm md:w-5/12 xl:w-80`}
            >
              <div className="p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-32 h-32 object-cover object-center rounded-full border-4 border-white shadow-md"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <div className="mt-1 mb-3 text-sm font-medium text-gray-800">
                  {member.role}
                </div>
                <p className="text-gray-700 mt-2 text-sm">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
              Wedding Party
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-rose-200 -z-10 transform -rotate-1"></span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            We're so grateful to have these special people standing beside us on
            our big day. Each one has played an important role in our lives and
            our journey together.
          </p>
        </div>

        {/* Bride's Side */}
        {renderPartySection(
          "Bride's Side",
          weddingPartyData.bridesSide,
          "bg-rose-50"
        )}

        {/* Groom's Side */}
        {renderPartySection(
          "Groom's Side",
          weddingPartyData.groomsSide,
          "bg-blue-50"
        )}

        {/* Special Roles */}
        {renderPartySection(
          "Special Roles",
          weddingPartyData.specialRoles,
          "bg-amber-50"
        )}
      </section>
    </DefaultLayout>
  );
}
