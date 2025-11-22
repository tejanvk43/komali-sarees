import { Link } from 'wouter';
import { MapPin, Mail, Phone, X } from 'lucide-react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const fullAboutText = `About Us: Harish's Silk Saree House || 9966888618 || Started in 2015 is a unique blend of shopping and customisation We have pioneered in that form of business line to make things better we have a whole range of customisable options across all the price ranges. Our Product Lines: We deals wide range products of Silks Sarees, Fancy Sarees, Bengal Cotton Sarees, Printed Cotton Sarees, Khadi Cotton Sarees, Linen Sarees, Pure Silk Sarees, Kanchi Sarees, Exclusive Designers which are developed in hose Sarees, Ikath Silk Sarees, Ikath Cotton Sarees, Mangalagiri Sarees, Madhubani Sarees, Gollabhama Sarees, Coimbatore Silks Sarees, Coimbatore Fancy Sarees, Banaras Sarees, Lucknow Sarees, Maheswari Sarees, Chanderi Sarees, Bagh Prints Sarees, Pulkari Sarees, Gujari Sarees, Kota Sarees, Computer Embroidery, Machinery Embroidery, Aari Embroidery, Hand Paints Sarees and Customised Digital Prints Sarees. Our History: Our roots in business stretch from 1958 in Vijayawada in the name of Gopu Subba Rao and the very person who has paved the way and inspired the generation. The light he shone is shining brightly in to its third generation and the values and ethics which continue to run till date and also will continue in future. These ethics and values formed the backbone of business along with strong customer satisfaction.`;

  return (
    <>
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/images/logo.png" 
                  alt="Komali Sarees Logo" 
                  className="h-20 w-20 rounded-full bg-white p-2"
                />
              </div>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed">
                  About Us: Harish's Silk Saree House || 9966888613 || Started in 2015 is a unique blend of shopping and customisation. We have pioneered in that form of...{' '}
                  <button 
                    onClick={() => setShowAboutModal(true)}
                    className="text-orange-500 cursor-pointer hover:underline font-medium"
                  >
                    VIEW MORE
                  </button>
                </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-gray-400" />
                  <p>
                    Lakshmi Villa 2nd Floor, D.No. 40-15-9/13, Brindavan Colony, Nandamuri Road, Mbs Jewellers
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <a href="mailto:hssh7691@gmail.com" className="hover:text-white transition-colors">
                    hssh7691@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <a href="tel:09045137306" className="hover:text-white transition-colors">
                    09045137306
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Updated Products */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 uppercase tracking-wide">
              Recently Updated Products
            </h3>
            <div className="space-y-2">
              <Link href="/products">
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors">
                  Linen
                </button>
              </Link>
            </div>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 uppercase tracking-wide">
              Social
            </h3>
            
            {/* Facebook Page Embed Placeholder */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/images/logo.png" 
                  alt="Komali Sarees" 
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h4 className="text-gray-900 font-semibold">Harish's silk saree ...</h4>
                  <p className="text-gray-600 text-sm">1,673 followers</p>
                </div>
              </div>
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Follow Page
              </a>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm mb-3">Spread the word:</p>
              <div className="flex gap-4">
                <a 
                  href="https://wa.me/919966888613" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://pinterest.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Pinterest"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0a12 12 0 00-4.37 23.17c-.05-.95-.1-2.42.02-3.46.1-.94.67-2.84.67-2.84s-.17-.34-.17-.84c0-.79.46-1.38 1.03-1.38.49 0 .72.37.72.8 0 .49-.31 1.22-.47 1.9-.13.56.28 1.02.83 1.02.99 0 1.76-1.05 1.76-2.55 0-1.33-.96-2.26-2.33-2.26-1.59 0-2.52 1.19-2.52 2.42 0 .48.18.99.41 1.27.04.05.05.1.04.15-.04.18-.14.56-.16.64-.02.11-.08.13-.19.08-.69-.32-1.13-1.33-1.13-2.14 0-1.75 1.27-3.36 3.67-3.36 1.93 0 3.43 1.37 3.43 3.21 0 1.91-1.21 3.45-2.88 3.45-.56 0-1.09-.29-1.27-.64 0 0-.28 1.07-.35 1.33-.13.51-.48 1.15-.71 1.54.54.17 1.11.26 1.71.26 6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Komali Sarees. All rights reserved.
          </p>
        </div>
      </div>
      </footer>

      {/* About Us Modal */}
      <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              Komali- Panorama Of Indian Handlooms
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {fullAboutText}
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAboutModal(false)}
              className="px-8"
            >
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
