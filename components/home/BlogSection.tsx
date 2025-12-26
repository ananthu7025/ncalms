'use client';

import { Zap, Calendar, Folder, ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/animations/Reveal';
import Link from 'next/link';

export default function BlogSection() {
    const blogs = [
        {
            image: '/assets/img/images/content-img-1.png',
            category: 'Learning',
            title: 'Repurpose mission critical action life items rather total linkage suds',
            date: 'August 15, 2025',
            author: 'Marketing'
        },
        {
            image: '/assets/img/images/content-img-2.png',
            category: 'Learning',
            title: 'Strategies for Managing Stress and Preventing Burnout in Education',
            date: 'August 15, 2025',
            author: 'Marketing'
        }
    ];

    return (
        <section className="blog-section pt-120 pb-120 bg-background relative overflow-hidden">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-16">
                    <Reveal y={-20} delay={0.1}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4">
                            <Zap size={14} className="fill-current" />
                            <span>News & Blogs</span>
                        </div>
                    </Reveal>
                    <Reveal scale={0.9} delay={0.2}>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                            Latest News Updates
                        </h2>
                    </Reveal>
                </div>

                {/* Blog Grid */}
                <div className="row g-4 justify-content-center">
                    {blogs.map((blog, index) => (
                        <div className="col-lg-6" key={index}>
                            <Reveal y={30} delay={0.2 + (index * 0.1)} className="h-full">
                                <Link href="/blog-details" className="block h-full border-0 group">
                                    <div className="blog-card relative h-[450px] rounded-[32px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                                        {/* Background Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Permanent Gradient Overlay for text visibility */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90"></div>
                                        </div>

                                        {/* Content Overlay */}
                                        <div style={{ padding: "16px" }} className="absolute inset-0 p-12 md:p-16 flex flex-col justify-end items-start h-full">

                                            {/* Top Badge */}
                                            <div className="absolute top-10 left-10">
                                                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-primary transition-colors duration-300">
                                                    {blog.category}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white leading-tight group-hover:text-primary-light transition-colors duration-300">
                                                {blog.title}
                                            </h3>

                                            {/* Divider */}
                                            <div className="w-full h-px bg-white/20 mb-6 group-hover:bg-primary/50 transition-colors duration-300"></div>

                                            {/* Meta Data */}
                                            <div className="flex items-center justify-between w-full text-white/80 text-sm font-medium">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-primary" />
                                                        <span>{blog.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Folder size={16} className="text-primary" />
                                                        <span>{blog.author}</span>
                                                    </div>
                                                </div>

                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 group-hover:translate-x-1">
                                                    <ArrowUpRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
