const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Get In Touch</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Have questions? We’d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="md:col-span-2 card p-6 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass focus-within:ring-2 focus-within:ring-primary-500/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Send us a message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="input-field w-full" placeholder="Your name" required />
                <input className="input-field w-full" placeholder="Email" type="email" required />
              </div>
              <input className="input-field w-full" placeholder="Phone (+91)" type="tel" />
              <textarea className="input-field w-full" placeholder="How can we help you?" rows={6} required />
              <button type="button" className="btn-primary">Send Message</button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="card p-5 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">support@homesphere.in</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">info@homesphere.in</p>
            </div>
            <div className="card p-5 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phone</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">+91 44 4000 1234</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Mon–Fri, 9:00 AM – 6:00 PM IST</p>
            </div>
            <div className="card p-5 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0 hover:shadow-glass">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Office</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">HomeSphere Technologies Pvt. Ltd.</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Tidel Park, Rajiv Gandhi Salai</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Taramani, Chennai, Tamil Nadu 600113</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
