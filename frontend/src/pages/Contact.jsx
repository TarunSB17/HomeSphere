const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
        <p className="text-gray-700 leading-7 mb-6">
          Have questions? Reach out and we’ll get back to you.
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-4">
            <input className="input-field w-full" placeholder="Your name" />
            <input className="input-field w-full" placeholder="Email" type="email" />
            <textarea className="input-field w-full" placeholder="Message" rows={5} />
            <button type="button" className="btn-primary">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
