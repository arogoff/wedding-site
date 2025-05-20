import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function RegistryPage() {
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
              Registry
            </span>
            <span className="absolute -bottom-2 left-0 w-full h-3 bg-rose-200 -z-10 transform -rotate-1"></span>
          </h1>
        </div>
      </section>
    </DefaultLayout>
  );
}
