import React from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MonitorPlay, FileText, Lock, Unlock, Clock, Tag, User, BookOpen, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSubjectById } from '@/lib/actions/subjects';
import { getActiveSubjectContents } from '@/lib/actions/subject-contents';

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
    const [subjectResult, contentsResult] = await Promise.all([
        getSubjectById(params.id),
        getActiveSubjectContents(params.id),
    ]);

    if (!subjectResult.success || !subjectResult.data) {
        notFound();
    }

    const { subject, stream, examType } = subjectResult.data;
    const contents = contentsResult.success && contentsResult.data ? contentsResult.data : [];

    // Group contents by content type
    const contentsByType = contents.reduce((acc: any, item: any) => {
        const typeName = item.contentType?.name || 'Other';
        if (!acc[typeName]) {
            acc[typeName] = [];
        }
        acc[typeName].push(item);
        return acc;
    }, {});

    const formatDuration = (minutes: number | null) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins} min`;
    };

    const getContentIcon = (typeName: string, hasAccess: boolean) => {
        const isVideo = typeName?.toLowerCase().includes('video');
        const Icon = isVideo ? MonitorPlay : FileText;
        const LockIcon = hasAccess ? Unlock : Lock;
        return { Icon, LockIcon, hasAccess };
    };

    return (
        <>
            <Header />
            <section className="course-details pt-32 pb-40 bg-gray-50/30">
                <div className="container">
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-xl-9 col-lg-8">
                            <div className="course-details-content pr-lg-5">
                                <div className="course-details-img mb-10 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                                    {subject.thumbnail ? (
                                        <img src={subject.thumbnail} alt={subject.title} className="w-100 h-auto object-cover" />
                                    ) : (
                                        <div className="w-full h-80 bg-gradient-to-br from-blue-600/20 to-teal-500/20 flex items-center justify-center">
                                            <span className="text-9xl font-bold text-blue-600/30">
                                                {subject.title.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="details-inner mb-10">
                                    <ul className="details-meta flex gap-4 mb-6 text-xs font-bold text-white pl-0 list-none">
                                        {stream && (
                                            <li className="bg-teal-500 px-5 py-2 rounded-full shadow-sm shadow-teal-500/20">
                                                {stream.name}
                                            </li>
                                        )}
                                        {examType && (
                                            <li className="bg-blue-600 px-5 py-2 rounded-full shadow-sm shadow-blue-600/20">
                                                {examType.name}
                                            </li>
                                        )}
                                    </ul>
                                    <h2 className="title text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                                        {subject.title}
                                    </h2>
                                    {subject.description && (
                                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                            {subject.description}
                                        </p>
                                    )}
                                </div>

                                <div className="course-details-tab border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    <Tabs defaultValue="overview" className="w-full">
                                        <TabsList className="w-full justify-start bg-gray-50 border-b border-gray-200 p-0 h-auto flex-wrap">
                                            <TabsTrigger value="overview" className="flex-1 rounded-none border-t-4 border-transparent data-[state=active]:border-teal-500 data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-none px-8 py-5 text-gray-500 font-bold text-lg transition-all hover:text-teal-600 gap-2">
                                                <BookOpen size={20} /> Overview
                                            </TabsTrigger>
                                            <TabsTrigger value="curriculum" className="flex-1 rounded-none border-t-4 border-transparent data-[state=active]:border-teal-500 data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-none px-8 py-5 text-gray-500 font-bold text-lg transition-all hover:text-teal-600 gap-2">
                                                <FileText size={20} /> Content
                                            </TabsTrigger>
                                        </TabsList>

                                        <div className="p-10 md:p-12 bg-white">
                                            <TabsContent value="overview" className="prose max-w-none text-gray-600 mt-0">
                                                <h3 className="text-3xl font-bold text-gray-900 mb-8">Course Description</h3>
                                                <p className="mb-8 leading-loose text-lg">
                                                    {subject.description || 'Comprehensive preparation for your NCA exam with expert-curated content designed to help you succeed.'}
                                                </p>

                                                <h3 className="text-3xl font-bold text-gray-900 mb-8">What You'll Get</h3>
                                                <ul className="space-y-3 mb-6">
                                                    {Object.keys(contentsByType).map((typeName) => (
                                                        <li key={typeName} className="flex items-center gap-3">
                                                            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                                                            <span className="text-lg">{contentsByType[typeName].length} {typeName} {contentsByType[typeName].length === 1 ? 'item' : 'items'}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {subject.isBundleEnabled && (
                                                    <>
                                                        <h3 className="text-3xl font-bold text-gray-900 mb-8 mt-10">Bundle Pricing</h3>
                                                        <p className="leading-loose text-lg">
                                                            Get access to all content types at a discounted price with our bundle option.
                                                            Purchase everything together and save!
                                                        </p>
                                                    </>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="curriculum" className="mt-0">
                                                <div className="curriculum-area">
                                                    {Object.keys(contentsByType).length === 0 ? (
                                                        <div className="text-center py-12 text-gray-500">
                                                            <p>No content available yet. Check back soon!</p>
                                                        </div>
                                                    ) : (
                                                        <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-6">
                                                            {Object.entries(contentsByType).map(([typeName, items]: [string, any], typeIndex) => (
                                                                <AccordionItem
                                                                    key={typeName}
                                                                    value={`item-${typeIndex}`}
                                                                    className="bg-white border border-gray-200 rounded-xl px-0 overflow-hidden shadow-sm"
                                                                >
                                                                    <AccordionTrigger className="hover:no-underline font-bold text-xl py-5 px-8 bg-gray-50 text-gray-900 data-[state=open]:text-teal-600 data-[state=open]:bg-white border-b border-transparent data-[state=open]:border-gray-100">
                                                                        {typeName} ({items.length} items)
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="px-8 pt-6 pb-2">
                                                                        <ul className="space-y-5 pb-2 text-gray-600 list-none pl-0">
                                                                            {items.map((item: any) => {
                                                                                const { Icon, LockIcon, hasAccess } = getContentIcon(
                                                                                    item.contentType?.name || '',
                                                                                    item.hasAccess || false
                                                                                );
                                                                                return (
                                                                                    <li
                                                                                        key={item.content.id}
                                                                                        className="flex justify-between items-center border-b border-dashed border-gray-200 pb-4 last:border-0 last:pb-0"
                                                                                    >
                                                                                        <div className="flex items-center gap-4 font-medium text-lg">
                                                                                            <Icon size={20} className="text-teal-500" />
                                                                                            {item.content.title}
                                                                                        </div>
                                                                                        <div className="flex items-center gap-3">
                                                                                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                                                                                                ${item.content.price}
                                                                                            </span>
                                                                                            {item.content.duration && (
                                                                                                <span className="text-sm font-semibold text-gray-500">
                                                                                                    {formatDuration(item.content.duration)}
                                                                                                </span>
                                                                                            )}
                                                                                            <LockIcon
                                                                                                size={14}
                                                                                                className={hasAccess ? 'text-teal-500' : 'text-red-400'}
                                                                                            />
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            ))}
                                                        </Accordion>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="col-xl-3 col-lg-4">
                            <div className="sticky top-24 space-y-8">
                                {subject.isBundleEnabled && subject.bundlePrice && (
                                    <div className="course-sidebar p-10 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50">
                                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                                            <h4 className="price text-5xl font-bold text-gray-900 mb-0">
                                                ${subject.bundlePrice}
                                            </h4>
                                            <span className="text-sm font-bold text-white bg-teal-500 px-3 py-1.5 rounded-lg shadow-lg shadow-teal-500/30">
                                                Bundle
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <button className="w-100 bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 uppercase tracking-wide text-sm border-0 transform hover:-translate-y-1">
                                                Add to Cart
                                            </button>
                                            <button className="w-100 bg-white text-teal-600 border-2 border-teal-600 font-bold py-3.5 rounded-xl hover:bg-teal-50 transition-colors uppercase tracking-wide text-sm">
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="course-sidebar p-10 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50">
                                    <h4 className="sidebar-title text-xl font-bold mb-8 text-gray-900 pb-4 border-b border-gray-100">
                                        Course Information
                                    </h4>
                                    <ul className="course-sidebar-list space-y-0 text-gray-600 list-none pl-0">
                                        {stream && (
                                            <li className="flex items-center justify-between border-b border-dashed border-gray-100 py-4 last:border-0">
                                                <span className="flex items-center gap-3 text-sm font-medium">
                                                    <Tag size={20} className="text-teal-500" />Stream:
                                                </span>
                                                <span className="font-bold text-gray-900 text-sm">{stream.name}</span>
                                            </li>
                                        )}
                                        {examType && (
                                            <li className="flex items-center justify-between border-b border-dashed border-gray-100 py-4 last:border-0">
                                                <span className="flex items-center gap-3 text-sm font-medium">
                                                    <BookOpen size={20} className="text-teal-500" />Exam Type:
                                                </span>
                                                <span className="font-bold text-gray-900 text-sm">{examType.name}</span>
                                            </li>
                                        )}
                                        <li className="flex items-center justify-between border-b border-dashed border-gray-100 py-4 last:border-0">
                                            <span className="flex items-center gap-3 text-sm font-medium">
                                                <FileText size={20} className="text-teal-500" />Total Items:
                                            </span>
                                            <span className="font-bold text-gray-900 text-sm">{contents.length}</span>
                                        </li>
                                    </ul>
                                    <div className="share-btn mt-10 pt-8 border-t border-gray-100">
                                        <button className="w-100 flex items-center justify-center gap-2 bg-gray-50 text-teal-600 py-4 rounded-xl hover:bg-teal-600 hover:text-white transition-all font-bold text-sm border-0">
                                            <Share2 size={18} /> Share This Course
                                        </button>
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
