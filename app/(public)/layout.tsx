import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Bootstrap CSS for Public Pages */}
            <link rel="shortcut icon" type="text/io" href="/assets/img/logo/logo.jpeg" />
            <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
            <link rel="stylesheet" href="/assets/css/main.css" />

            <SmoothScrollProvider>
                {children}
            </SmoothScrollProvider>
        </>
    );
}
