const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <section>
          <h1 className="text-4xl font-extrabold text-primary-700 mb-3">About DreamHomes</h1>
          <p className="text-gray-700 leading-7 mb-3">
            Founded with a simple idea — make home discovery delightful — DreamHomes blends cutting-edge 3D visualization with a curated marketplace of premium properties. We help buyers explore spaces as if they were there, and empower sellers with immersive storytelling that increases engagement and trust.
          </p>
          <p className="text-gray-700 leading-7 mb-3">
            Our platform showcases verified listings, cinematic photo galleries, and interactive 3D previews powered by Cloudinary. Whether you are searching for a city loft, a beachfront villa, or a mountain retreat, DreamHomes gives you the clarity and confidence to decide faster.
          </p>
          <p className="text-gray-700 leading-7">
            With responsive design, secure authentication, and powerful search, we aim to deliver a smooth experience across devices. We are constantly enhancing our buyer and seller journeys to keep real estate modern, transparent, and beautiful.
          </p>
        </section>

        {/* Image gallery */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">A glimpse of what we feature</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
            ].map((src, idx) => (
              <div key={idx} className="aspect-video rounded-lg overflow-hidden shadow bg-white">
                <img src={src} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact (small section) */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contact</h2>
          <p className="text-gray-600 mb-4">Have questions? Send us a message and our team will get back within 1 business day.</p>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input-field focus:ring-primary-500" placeholder="Your name" />
            <input className="input-field focus:ring-primary-500" placeholder="Email" type="email" />
            <textarea className="input-field md:col-span-2 focus:ring-primary-500" placeholder="Message" rows={4} />
            <div className="md:col-span-2">
              <button type="button" className="btn-primary bg-primary-600 hover:bg-primary-700">Send</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default About;
