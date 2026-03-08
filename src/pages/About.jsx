import logo from '../assets/logo.png';
import DynamicBanner from '../components/DynamicBanner';

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Banner Section */}
      <DynamicBanner page="about" />

      {/* Company Introduction */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Who We Are</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed flex items-center flex-wrap gap-2">
            <img 
              src={logo} 
              alt="GK2 Logo" 
              className="h-6 w-auto inline-block"
            />
            <span>(GelKrupa Electronics) is a leading manufacturer of electrical switchgear products, 
            specializing in Miniature Circuit Breakers (MCBs), bus bars, and comprehensive electrical 
            protection solutions. With years of experience in the industry, we have established ourselves 
            as a trusted partner for businesses across industrial and commercial sectors.</span>
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Our commitment to safety, quality, and customer satisfaction drives everything we do. 
            We combine advanced manufacturing techniques with rigorous quality control to deliver 
            products that meet the highest standards of electrical safety and reliability.
          </p>
        </div>
      </section>

      {/* Company History */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Our History</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed flex items-center flex-wrap gap-2">
            <span>Founded with a vision to provide reliable electrical protection solutions,</span>
            <img 
              src={logo} 
              alt="GK2 Logo" 
              className="h-6 w-auto inline-block"
            />
            <span>has grown from a small workshop to a modern manufacturing facility. Our 
            journey has been marked by continuous innovation in switchgear technology, strategic 
            investments in manufacturing capabilities, and an unwavering focus on electrical safety.</span>
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            Over the years, we have expanded our MCB product line to serve diverse industries, from 
            heavy industrial three-phase systems to residential and commercial single-phase applications. 
            Our growth is a testament to the trust our customers place in us and our dedication to 
            providing superior electrical protection solutions.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Our Mission</h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            To provide innovative, high-quality electrical switchgear products that ensure safe and 
            reliable electrical protection for businesses and homes. We strive to be the preferred 
            partner for our customers by delivering exceptional MCBs and switchgear components, 
            outstanding service, and continuous value through innovation and technical expertise.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-600">Quality Excellence</h3>
              <p className="text-sm sm:text-base text-gray-700">
                We never compromise on quality. Every product undergoes rigorous testing and 
                quality control to ensure it meets our exacting standards and exceeds customer 
                expectations.
              </p>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-600">Innovation</h3>
              <p className="text-sm sm:text-base text-gray-700">
                We continuously invest in research and development to stay at the forefront of 
                technology, bringing innovative solutions to our customers' evolving needs.
              </p>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-600">Customer Focus</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Our customers are at the heart of everything we do. We listen, understand, and 
                deliver solutions that address their specific requirements and challenges.
              </p>
            </div>
            <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-blue-600">Integrity</h3>
              <p className="text-sm sm:text-base text-gray-700">
                We conduct our business with honesty, transparency, and ethical practices, 
                building lasting relationships based on trust and mutual respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Our Expertise</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
            With extensive experience in electronic component manufacturing, we specialize in:
          </p>
          <ul className="space-y-3 text-base sm:text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 mt-1">✓</span>
              <span>Miniature Circuit Breakers (MCBs) with various current ratings and pole configurations</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 mt-1">✓</span>
              <span>Single, double, triple, and four-pole MCBs for diverse electrical applications</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 mt-1">✓</span>
              <span>Modular and compact MCB designs for space-constrained installations</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 mt-1">✓</span>
              <span>High-quality bus bars and electrical distribution components</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 mt-1">✓</span>
              <span>Technical consultation and support for optimal electrical protection solutions</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default About;
