import DynamicBanner from '../components/DynamicBanner';

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Banner Section */}
      <DynamicBanner page="contact" />

      {/* Contact Information */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 max-w-5xl lg:max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="text-blue-600 text-2xl mr-4 mt-1">✉</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a 
                      href="mailto:info@gelkrupa.com" 
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      info@gelkrupa.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="text-blue-600 text-2xl mr-4 mt-1">📞</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a 
                      href="tel:+1234567890" 
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className="text-blue-600 text-2xl mr-4 mt-1">📍</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-700">
                      123 Industrial Park Drive<br />
                      Manufacturing District<br />
                      City, State 12345<br />
                      Country
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">
                Business Hours
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Monday - Friday</span>
                  <span className="text-gray-900">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Saturday</span>
                  <span className="text-gray-900">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Sunday</span>
                  <span className="text-gray-900">Closed</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Note:</span> For urgent inquiries outside 
                  business hours, please send us an email and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 lg:mt-10 bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
              How Can We Help?
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
              Whether you have questions about our products, need technical specifications, 
              or want to discuss custom solutions for your business, our team is here to help. 
              We pride ourselves on providing prompt, professional service to all our customers.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Feel free to reach out via email or phone, and one of our knowledgeable team 
              members will be happy to assist you with your inquiry.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
