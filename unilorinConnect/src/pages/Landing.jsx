import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, BookOpen, Users, Calendar, Bell, Search } from 'lucide-react';
import { authStore } from '../store/useAuthStore';

const Landing = () => {
  const navigate = useNavigate();
  const {user} = authStore();

  console.log(user);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">UnilorinConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
              onClick={() => navigate('/signup')}
            >
              Join Free
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ultimate Hub</span> for University of Ilorin Students
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Join 50,000+ students connecting, trading, and thriving together. UnilorinConnect is your all-in-one campus companion designed to make university life seamless and social.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center shadow-lg shadow-blue-500/30"
                onClick={() => navigate('/signup')}
              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => navigate('/login')}
              >
                See How It Works
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((item) => (
                  <div key={item} className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">4,200+</span> students joined this week
              </div>
            </div>
          </div>
          <div className="hidden md:block animate-fade-in">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-100 rounded-2xl -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-indigo-100 rounded-2xl -z-10"></div>
              <img 
                src="https://media.istockphoto.com/id/92259124/photo/laptop-computer-with-books-pen-and-yellow-legal-pad.jpg?s=1024x1024&w=is&k=20&c=tou6Bs5Q3BMx4op_geafzHCXlL_EWtMjjSTas-6idhE=" 
                alt="University students"
                className="rounded-2xl shadow-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Badges */}
      <section className="py-8 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Daily Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <div className="text-gray-600">Positive Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Campus Life</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed by students, for students - all the tools you need in one intuitive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Marketplace',
                description: 'Buy, sell, and trade textbooks, electronics, and more with verified students. Our escrow system ensures safe transactions.',
                icon: <BookOpen className="w-8 h-8 text-blue-600" />
              },
              {
                title: 'Campus Events',
                description: 'Never miss another event. RSVP to parties, academic seminars, and club meetings with real-time updates.',
                icon: <Calendar className="w-8 h-8 text-blue-600" />
              },
              {
                title: 'Study Resources',
                description: 'Access the largest collection of lecture notes, past questions, and study guides curated by top students.',
                icon: <BookOpen className="w-8 h-8 text-blue-600" />
              },
              {
                title: 'Secure Messaging',
                description: 'Connect with classmates, lecturers, and campus organizations through our encrypted chat system.',
                icon: <MessageSquare className="w-8 h-8 text-blue-600" />
              },
              {
                title: 'Lost & Found',
                description: 'AI-powered matching to reunite lost items with their owners across campus.',
                icon: <Search className="w-8 h-8 text-blue-600" />
              },
              {
                title: 'Smart Notifications',
                description: 'Personalized alerts for classes, events, and marketplace activity based on your preferences.',
                icon: <Bell className="w-8 h-8 text-blue-600" />
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Students</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from your peers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Sold my textbooks in minutes and found the perfect roommate through UnilorinConnect. Game changer!",
                name: "Aisha Mohammed",
                role: "300 Level Computer Science"
              },
              {
                quote: "The past questions collection saved my GPA last semester. Worth every minute spent on this platform.",
                name: "Tunde Ogunlesi",
                role: "400 Level Law"
              },
              {
                quote: "As an introvert, making friends was hard until I joined study groups on UnilorinConnect.",
                name: "Chioma Eze",
                role: "200 Level Medicine"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="text-4xl text-gray-200 mb-4">"</div>
                <p className="text-gray-700 text-lg mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Future of Campus Life Today</h2>
          <p className="text-xl mb-8 opacity-90">
            UnilorinConnect is completely free for students. Sign up in 30 seconds and start connecting immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
              onClick={() => navigate('/signup')}
            >
              Create Free Account
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate('/login')}
            >
              See Demo
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-80">No credit card required • Verified .edu.ng email only</p>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about UnilorinConnect
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "Is UnilorinConnect really free?",
                answer: "Yes! Our platform is completely free for all University of Ilorin students. We're committed to enhancing campus life without any cost barriers."
              },
              {
                question: "How do you verify students?",
                answer: "We use your official university email (@student.unilorin.edu.ng) for verification. This ensures only genuine students can join the community."
              },
              {
                question: "Can I use this as a freshman?",
                answer: "Absolutely! In fact, we recommend joining before resumption to connect with roommates, buy textbooks, and get campus tips from seniors."
              },
              {
                question: "Is my data secure?",
                answer: "We use enterprise-grade encryption and never share your data with third parties. Your privacy is our top priority."
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <span className="font-bold text-xl text-white">UnilorinConnect</span>
              <p className="mt-4">The ultimate campus companion for University of Ilorin students since 2023.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">What's New</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>© 2025 UnilorinConnect. All rights reserved. Made with ❤️ for UNILORIN students</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;