import Link from 'next/link';
import { Phone, MapPin, Clock, User, Heart, ShoppingCart, Menu } from 'lucide-react';
import auth from "@/auth";
import { getCartItemCount } from "@/lib/actions/cart";

export default async function Header() {
    const session = await auth();
    const cartItemCount = await getCartItemCount();

    return (
        <header className="header header-3 header-6 sticky-active">
            <div className="primary-header">
                <div className="container">
                    <div className="primary-header-inner">
                        <div className="header-logo d-lg-block">
                            <Link href="/">
                                <img src="/assets/img/logo/logo-new.jpeg" alt="Logo" />
                            </Link>
                        </div>
                        <div className="header-menu-wrap">
                            <div className="mobile-menu-items">
                                <ul className="sub-menu">
                                    <li className="menu-item-has-children active mega-menu">
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li className="menu-item-has-children">
                                        <Link href="/courses">Courses</Link>
                                    </li>
                                    <li className="menu-item-has-children">
                                        <Link href="/about">About us</Link>
                                    </li>
                                    <li><Link href="/contact">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="header-right-wrap">
                            <div className="header-right">
                                <div className="header-right-icon shop-btn">
                                    <Link href="/cart"><ShoppingCart size={20} /></Link>
                                    <span className="number">{cartItemCount}</span>
                                </div>
                                {session?.user ? (
                                    <Link
                                        href={session.user.role === 'ADMIN' ? "/admin/dashboard" : "/learner/dashboard"}
                                        className="ed-primary-btn header-btn"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/login" className="ed-primary-btn header-btn">Login</Link>
                                )}
                                <div className="header-logo d-none d-lg-none">
                                    <Link href="/">
                                        <img src="/assets/img/logo/logo-new.jpeg" alt="Logo" />
                                    </Link>
                                </div>
                                <div className="header-right-item d-lg-none d-md-block">
                                    <a href="#" className="mobile-side-menu-toggle">
                                        <Menu size={24} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
