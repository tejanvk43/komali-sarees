import { ScrollReveal } from "@/components/ScrollReveal";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
              About Us
            </h1>
            <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
              Panorama Of Indian Handlooms
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* About Us Section */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-6">
                About Us
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Harish's Silk Saree House || 9966888618 || Started in 2015 is a unique blend of shopping and customisation We have pioneered in that form of business line to make things better we have a whole range of customisable options across all the price ranges.
              </p>
            </div>
          </ScrollReveal>

          {/* Product Lines Section */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-6">
                Our Product Lines
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                We deals wide range products of Silks Sarees, Fancy Sarees, Bengal Cotton Sarees, Printed Cotton Sarees, Khadi Cotton Sarees, Linen Sarees, Pure Silk Sarees, Kanchi Sarees, Exclusive Designers which are developed in hose Sarees, Ikath Silk Sarees, Ikath Cotton Sarees, Mangalagiri Sarees, Madhubani Sarees, Gollabhama Sarees, Coimbatore Silks Sarees, Coimbatore Fancy Sarees, Banaras Sarees, Lucknow Sarees, Maheswari Sarees, Chanderi Sarees, Bagh Prints Sarees, Pulkari Sarees, Gujari Sarees, Kota Sarees, Computer Embroidery, Machinery Embroidery, Aari Embroidery, Hand Paints Sarees and Customised Digital Prints Sarees.
              </p>
            </div>
          </ScrollReveal>

          {/* History Section */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-6">
                Our History
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our roots in business stretch from 1958 in Vijayawada in the name of Gopu Subba Rao and the very person who has paved the way and inspired the generation. The light he shone is shining brightly in to its third generation and the values and ethics which continue to run till date and also will continue in future. These ethics and values formed the backbone of business along with strong customer satisfaction.
              </p>
            </div>
          </ScrollReveal>

          {/* Contact Info */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="bg-primary text-white rounded-lg shadow-sm p-8">
              <h2 className="font-serif text-3xl font-bold mb-6">
                Get In Touch
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Address:</h3>
                  <p className="opacity-90">
                    Lakshmi Villa 2nd Floor, D.No. 40-15-9/13,<br />
                    Brindavan Colony, Nandamuri Road,<br />
                    Mbs Jewellers
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Contact:</h3>
                  <p className="opacity-90">
                    Phone: 9045137306<br />
                    Mobile: 9966888618<br />
                    Email: hssh7691@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
