'use client';


export default function testPage(email: string) {
    console.log('email', email);
    if (!email) {
        return <h1>Forbidden</h1>
    }
    return (
        <div>
            <h1>Test Page</h1>
        </div>
    );
}