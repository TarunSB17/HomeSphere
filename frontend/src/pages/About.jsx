const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <section>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">About HomeSphere</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Revolutionising real estate with immersive 3D technology</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass focus-within:ring-2 focus-within:ring-primary-500/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-7">
                We’re transforming the way people discover and experience properties. By combining premium listings with immersive 3D visualisation, we make property hunting engaging, efficient and delightful for buyers while empowering sellers with modern storytelling.
              </p>
            </div>
            <div className="card p-6 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass focus-within:ring-2 focus-within:ring-primary-500/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Curated Listings</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-7">
                Every property on our platform is carefully vetted and presented with detailed information, high‑quality images and comprehensive feature lists, so you can compare confidently.
              </p>
            </div>
            <div className="card p-6 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass focus-within:ring-2 focus-within:ring-primary-500/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Immersive Experience</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-7">
                Explore spaces virtually with interactive 3D previews from the comfort of your home. Understand scale, layout and finishes before scheduling a visit.
              </p>
            </div>
            <div className="card p-6 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass focus-within:ring-2 focus-within:ring-primary-500/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Our Vision</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-7">
                We envision a future where every home buyer can walk through their dream property online. HomeSphere bridges the gap between traditional real estate and cutting‑edge digital innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Image gallery */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">A glimpse of what we feature</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
            ].map((src, idx) => (
              <div key={idx} className="aspect-video rounded-lg overflow-hidden shadow card">
                <img src={src} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform" />
              </div>
            ))}
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default About;
