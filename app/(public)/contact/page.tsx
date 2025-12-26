import React from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { User, Mail, MessageSquare, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
    return (
        <>
            <Header />
            <section className="contact-section py-20 lg:py-28 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7">
                            <div className="blog-contact-form contact-form bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100">
                                <h2 className="title text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leave A Reply</h2>
                                <p className="text-gray-600 mb-8">Fill-up The Form and Message us of your amazing question</p>
                                <div className="request-form">
                                    <form action="#" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="form-item relative">
                                                <input type="text" id="fullname" name="fullname" className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-0 outline-none text-gray-700 transition-all bg-white" placeholder="Your Name" />
                                                <div className="icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <User size={20} />
                                                </div>
                                            </div>
                                            <div className="form-item relative">
                                                <input type="email" id="email" name="email" className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-0 outline-none text-gray-700 transition-all bg-white" placeholder="Your Email" />
                                                <div className="icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Mail size={20} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-item">
                                            <select name="subject" id="subject" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-0 outline-none text-gray-500 transition-all bg-white appearance-none cursor-pointer">
                                                <option value="">Select Subject</option>
                                                <option value="2">Plan 1</option>
                                                <option value="3">Plan 2</option>
                                                <option value="4">Plan 3</option>
                                            </select>
                                        </div>
                                        <div className="form-item relative">
                                            <textarea id="message" name="message" cols={30} rows={5} className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-0 outline-none text-gray-700 transition-all bg-white resize-none" placeholder="Message"></textarea>
                                            <div className="icon absolute left-4 top-6 text-gray-400">
                                                <MessageSquare size={20} />
                                            </div>
                                        </div>
                                        <div className="submit-btn">
                                            <button id="submit" className="w-full md:w-auto bg-teal-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 uppercase tracking-wide text-sm" type="submit">Submit Message</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1 md:col-span-12"></div>
                        <div className="lg:col-span-4 col-md-12">
                            <div className="contact-content bg-teal-600 text-white p-10 rounded-3xl h-full shadow-xl shadow-teal-600/10 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-700 rounded-full blur-3xl opacity-20 -ml-16 -mb-16 pointer-events-none"></div>

                                <div className="contact-top mb-10 relative z-10">
                                    <h3 className="title text-3xl font-bold mb-4">Office Information</h3>
                                    <p className="text-teal-50 leading-relaxed">Completely recapitalize 24/7 communities via standards compliant metrics whereas.</p>
                                </div>
                                <div className="contact-list space-y-8 relative z-10">
                                    <div className="list-item flex gap-4">
                                        <div className="icon w-12 h-12 flex items-center justify-center bg-white/10 rounded-full shrink-0 text-white backdrop-blur-sm">
                                            <Phone size={20} />
                                        </div>
                                        <div className="content">
                                            <h4 className="title font-bold text-lg mb-1">Phone Number & Email</h4>
                                            <div className="flex flex-col text-teal-50 gap-1">
                                                <a href="tel:+65485965789" className="hover:text-white transition-colors">(+65) - 48596 - 5789</a>
                                                <a href="mailto:hello@edcare.com" className="hover:text-white transition-colors">hello@edcare.com</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list-item flex gap-4">
                                        <div className="icon w-12 h-12 flex items-center justify-center bg-white/10 rounded-full shrink-0 text-white backdrop-blur-sm">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="content">
                                            <h4 className="title font-bold text-lg mb-1">Our Office Address</h4>
                                            <p className="text-teal-50 leading-relaxed">2690 Hilton Street Victoria Road, <br />New York, Canada</p>
                                        </div>
                                    </div>
                                    <div className="list-item flex gap-4">
                                        <div className="icon w-12 h-12 flex items-center justify-center bg-white/10 rounded-full shrink-0 text-white backdrop-blur-sm">
                                            <Clock size={20} />
                                        </div>
                                        <div className="content">
                                            <h4 className="title font-bold text-lg mb-1">Official Work Time</h4>
                                            <div className="flex flex-col text-teal-50 gap-1">
                                                <span>Monday - Friday: 09:00 - 20:00</span>
                                                <span>Sunday & Saturday: 10:30 - 22:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
