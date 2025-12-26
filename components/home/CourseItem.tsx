import Link from 'next/link';
import { FileText, User, Eye, Star } from 'lucide-react';

interface CourseItemProps {
    image: string;
    category?: string;
    title: string;
    lessons: string;
    students: string;
    views: string;
    authorImg: string;
    authorName: string;
    price: string;
}

export default function CourseItem({
    image,
    category = "Free",
    title,
    lessons,
    students,
    views,
    authorImg,
    authorName,
    price
}: CourseItemProps) {
    return (
        <div className="course-item">
            <div className="course-thumb-wrap">
                <div className="course-thumb">
                    <img src={image} alt="course" />
                </div>
            </div>
            <div className="course-content">
                <span className="offer">{category}</span>
                <h3 className="title"><Link href="/course-details">{title}</Link></h3>
                <ul className="course-list">
                    <li><FileText size={16} />{lessons}</li>
                    <li><User size={16} />{students}</li>
                    <li><Eye size={16} />{views}</li>
                </ul>
                <div className="course-author-box">
                    <div className="course-author">
                        <div className="author-img">
                            <img src={authorImg} alt="author" />
                        </div>
                        <div className="author-info">
                            <h4 className="name">{authorName}</h4>
                            <span>Instructor</span>
                        </div>
                    </div>
                    <ul className="course-review">
                        <li><Star size={14} fill="currentColor" /></li>
                        <li><Star size={14} fill="currentColor" /></li>
                        <li><Star size={14} fill="currentColor" /></li>
                        <li><Star size={14} fill="currentColor" /></li>
                        <li><Star size={14} fill="currentColor" /></li>
                        <li className="point">(4.7)</li>
                    </ul>
                </div>
            </div>
            <div className="bottom-content">
                <span className="price">{price}</span>
                <Link href="/courses/123" className="course-btn">View Details</Link>
            </div>
        </div>
    );
}
